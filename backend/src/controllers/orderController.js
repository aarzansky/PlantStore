const Order = require('../models/Order');
const Plant = require('../models/Plant');
const KhaltiLog = require('../models/KhaltiLog');
const { initiateKhaltiPayment, lookupKhaltiPayment } = require('../utils/khalti');

// Best-effort audit logging - a logging failure should never break a payment flow,
// so this only ever console.errors and never throws.
const logKhaltiEvent = async (fields) => {
  try {
    await KhaltiLog.create(fields);
  } catch (err) {
    console.error('Failed to write KhaltiLog entry:', err);
  }
};

// Generate a human-friendly order number, e.g. ORD-4F2A9C
const generateOrderNumber = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${random}`;
};

// Shared helper: validates cart items against the DB, builds order line items,
// computes the total, and reserves stock. Throws { status, message } on failure.
const buildOrderFromCart = async (items) => {
  if (!items || items.length === 0) {
    throw { status: 400, message: 'No items in order' };
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const plant = await Plant.findById(item._id || item.plant);
    if (!plant) {
      throw { status: 404, message: `Plant not found: ${item.name || item._id}` };
    }
    if (plant.stock < item.quantity) {
      throw { status: 400, message: `Not enough stock for ${plant.name}. Only ${plant.stock} left.` };
    }

    orderItems.push({
      plant: plant._id,
      name: plant.name,
      price: plant.price,
      quantity: item.quantity,
    });

    totalAmount += plant.price * item.quantity;
  }

  // Reserve stock
  for (const item of orderItems) {
    await Plant.findByIdAndUpdate(item.plant, { $inc: { stock: -item.quantity } });
  }

  return { orderItems, totalAmount };
};

const restoreStock = async (order) => {
  for (const item of order.items) {
    await Plant.findByIdAndUpdate(item.plant, { $inc: { stock: item.quantity } });
  }
};

const validateShippingAddress = (shippingAddress) => {
  return (
    shippingAddress &&
    shippingAddress.fullName &&
    shippingAddress.phone &&
    shippingAddress.address &&
    shippingAddress.city
  );
};

// @desc    Create a new order (Cash on Delivery only — Khalti uses /khalti/initiate)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (paymentMethod === 'khalti') {
      return res.status(400).json({
        message: 'Use /api/orders/khalti/initiate to start a Khalti payment.',
      });
    }

    if (!validateShippingAddress(shippingAddress)) {
      return res.status(400).json({ message: 'Please provide complete shipping details' });
    }

    const { orderItems, totalAmount } = await buildOrderFromCart(items);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: 'cod',
    });

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Something went wrong' });
  }
};

// @desc    Create an order and start a Khalti payment, returning the payment_url to redirect to
// @route   POST /api/orders/khalti/initiate
// @access  Private
const initiateKhaltiOrderPayment = async (req, res) => {
  let order;
  try {
    const { items, shippingAddress } = req.body;

    if (!validateShippingAddress(shippingAddress)) {
      return res.status(400).json({ message: 'Please provide complete shipping details' });
    }

    const { orderItems, totalAmount } = await buildOrderFromCart(items);

    order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: 'khalti',
      paymentStatus: 'unpaid',
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const initiatePayload = {
      amount: Math.round(totalAmount * 100), // paisa
      purchaseOrderId: order.orderNumber,
      purchaseOrderName: `PlantStore Order ${order.orderNumber}`,
      returnUrl: `${frontendUrl}/payment/khalti/callback`,
      websiteUrl: frontendUrl,
      customerInfo: {
        name: shippingAddress.fullName,
        email: req.user.email,
        phone: shippingAddress.phone,
      },
    };

    let khaltiResponse;
    try {
      khaltiResponse = await initiateKhaltiPayment(initiatePayload);
    } catch (khaltiError) {
      await logKhaltiEvent({
        order: order._id,
        pidx: null,
        event: 'initiate',
        requestPayload: initiatePayload,
        responsePayload: khaltiError.khaltiResponse || null,
        success: false,
        errorMessage: khaltiError.message,
      });
      throw khaltiError;
    }

    await logKhaltiEvent({
      order: order._id,
      pidx: khaltiResponse.pidx,
      event: 'initiate',
      requestPayload: initiatePayload,
      responsePayload: khaltiResponse,
      success: true,
    });

    order.khaltiPidx = khaltiResponse.pidx;
    await order.save();

    res.status(201).json({
      success: true,
      order,
      payment_url: khaltiResponse.payment_url,
    });
  } catch (error) {
    console.error(error);
    // Roll back the order + reserved stock if Khalti initiation failed
    if (order) {
      await restoreStock(order);
      await Order.findByIdAndDelete(order._id);
    }
    res.status(error.status || 500).json({ message: error.message || 'Failed to start Khalti payment' });
  }
};

// @desc    Verify a Khalti payment after the user is redirected back, and update the order
// @route   GET /api/orders/khalti/verify?pidx=...
// @access  Private
const verifyKhaltiOrderPayment = async (req, res) => {
  try {
    const { pidx } = req.query;
    if (!pidx) {
      return res.status(400).json({ message: 'pidx is required' });
    }

    const order = await Order.findOne({ khaltiPidx: pidx });
    if (!order) {
      return res.status(404).json({ message: 'Order not found for this payment' });
    }

    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    let lookup;
    try {
      lookup = await lookupKhaltiPayment(pidx);
    } catch (khaltiError) {
      await logKhaltiEvent({
        order: order._id,
        pidx,
        event: 'lookup',
        requestPayload: { pidx },
        responsePayload: khaltiError.khaltiResponse || null,
        success: false,
        errorMessage: khaltiError.message,
      });
      throw khaltiError;
    }

    await logKhaltiEvent({
      order: order._id,
      pidx,
      event: 'lookup',
      requestPayload: { pidx },
      responsePayload: lookup,
      success: true,
    });

    // Only trust Khalti's lookup status, never the redirect params alone
    if (lookup.status === 'Completed') {
      if (order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.khaltiTransactionId = lookup.transaction_id;
        if (order.status === 'pending') {
          order.status = 'processing';
        }
        order.updatedAt = Date.now();
        await order.save();
      }
    } else if (['Expired', 'User canceled', 'Refunded'].includes(lookup.status)) {
      if (order.status !== 'cancelled') {
        order.status = 'cancelled';
        order.updatedAt = Date.now();
        await order.save();
        await restoreStock(order);
      }
    }
    // Pending / Initiated: leave the order as-is, frontend can poll or tell the user to wait

    res.json({ success: true, order, khaltiStatus: lookup.status });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Failed to verify Khalti payment' });
  }
};

// @desc    Get all orders for the logged-in user
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single order belonging to the logged-in user
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Customers may only view their own orders (admins use the /api/admin/orders route)
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an order (only while it's still pending or processing)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ message: `Order can no longer be cancelled (status: ${order.status})` });
    }

    order.status = 'cancelled';
    order.updatedAt = Date.now();
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Plant.findByIdAndUpdate(item.plant, { $inc: { stock: item.quantity } });
    }

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  initiateKhaltiOrderPayment,
  verifyKhaltiOrderPayment,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
