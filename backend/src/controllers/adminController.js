const Plant = require('../models/Plant');
const User = require('../models/User');
const Order = require('../models/Order');

// ==================== DASHBOARD STATS ====================

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalPlants = await Plant.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName email');

    res.json({
      success: true,
      stats: {
        totalPlants,
        totalUsers,
        totalOrders,
        totalRevenue,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PLANT MANAGEMENT ====================

// @desc    Create a new plant (Admin only)
// @route   POST /api/admin/plants
// @access  Private/Admin
const createPlant = async (req, res) => {
  try {
    const { name, categories, price, description, imageUrl, stock, rating, discountPercent } = req.body;

    const plant = await Plant.create({
      name,
      categories,
      price,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
      stock: stock || 10,
      rating: rating || 0,
      discountPercent: discountPercent || 0,
    });

    res.status(201).json({ success: true, plant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a plant (Admin only)
// @route   PUT /api/admin/plants/:id
// @access  Private/Admin
const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, plant: updatedPlant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a plant (Admin only)
// @route   DELETE /api/admin/plants/:id
// @access  Private/Admin
const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    await plant.deleteOne();
    res.json({ success: true, message: 'Plant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all plants (Admin view)
// @route   GET /api/admin/plants
// @access  Private/Admin
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find({}).sort({ createdAt: -1 });
    res.json({ success: true, plants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== USER MANAGEMENT ====================

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user (Admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle admin status of a user
// @route   PUT /api/admin/users/:id/toggle-admin
// @access  Private/Admin
const toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent toggling your own admin status
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own admin status' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ 
      success: true, 
      message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`,
      user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== ORDER MANAGEMENT ====================

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email');
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order (Admin only)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.plant', 'name price imageUrl');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({
        message: `Order is already ${order.status} and its status can no longer be changed`,
      });
    }

    order.status = status;
    await order.save();

    res.json({ 
      success: true, 
      message: `Order status updated to ${status}`,
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  createPlant,
  updatePlant,
  deletePlant,
  getAllPlants,
  getAllUsers,
  getUserById,
  deleteUser,
  toggleAdmin,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};