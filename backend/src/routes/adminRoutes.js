const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');
const Plant = require('../models/Plant');
const User = require('../models/User');
const Order = require('../models/Order');

// ============ DASHBOARD STATS ============

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalPlants = await Plant.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
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
});

// ============ PLANT MANAGEMENT ============

// @desc    Get all plants (Admin)
// @route   GET /api/admin/plants
router.get('/plants', protect, isAdmin, async (req, res) => {
  try {
    const plants = await Plant.find({}).sort({ createdAt: -1 });
    res.json({ success: true, plants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new plant
// @route   POST /api/admin/plants
router.post('/plants', protect, isAdmin, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, stock } = req.body;

    const plant = await Plant.create({
      name,
      category,
      price,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
      stock: stock || 10,
    });

    res.status(201).json({ success: true, plant, message: 'Plant added successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a plant
// @route   PUT /api/admin/plants/:id
router.put('/plants/:id', protect, isAdmin, async (req, res) => {
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

    res.json({ success: true, plant: updatedPlant, message: 'Plant updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a plant
// @route   DELETE /api/admin/plants/:id
router.delete('/plants/:id', protect, isAdmin, async (req, res) => {
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
});

// ============ USER MANAGEMENT ============

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
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
});

// @desc    Make user admin
// @route   PUT /api/admin/users/:id/make-admin
router.put('/users/:id/make-admin', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ success: true, message: 'User is now an admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ ORDER MANAGEMENT ============

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get('/orders', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email');
    
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single order (with populated plant details)
// @route   GET /api/admin/orders/:id
router.get('/orders/:id', protect, isAdmin, async (req, res) => {
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
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, order, message: 'Order status updated!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
router.delete('/orders/:id', protect, isAdmin, async (req, res) => {
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
});

module.exports = router;