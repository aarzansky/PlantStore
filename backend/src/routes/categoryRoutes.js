const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

// Public route
router.get('/', getAllCategories);

// Private/Admin routes
router.post('/', protect, isAdmin, createCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
