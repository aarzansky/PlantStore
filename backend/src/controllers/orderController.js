const Order = require('../models/Order');
const Plant = require('../models/Plant');

// Generate a human-friendly order number, e.g. ORD-4F2A9C
const generateOrderNumber = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${random}`;
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({ message: 'Please provide complete shipping details' });
    }

    // Look up real plant data so price/stock can't be tampered with from the client
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const plant = await Plant.findById(item._id || item.plant);
      if (!plant) {
        return res.status(404).json({ message: `Plant not found: ${item.name || item._id}` });
      }
      if (plant.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${plant.name}. Only ${plant.stock} left.` });
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

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod === 'khalti' ? 'khalti' : 'cod',
    });

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

// @desc    Cancel an order (only while it's still pending)
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

    if (order.status !== 'pending') {
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

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder };
