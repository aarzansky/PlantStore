const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, updateCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, updateCurrentUser);

module.exports = router;