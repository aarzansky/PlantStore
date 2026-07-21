const express = require('express');
const router = express.Router();
const {
  createOrder,
  initiateKhaltiOrderPayment,
  verifyKhaltiOrderPayment,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All routes are protected (require login)
router.post('/', protect, createOrder);
router.post('/khalti/initiate', protect, initiateKhaltiOrderPayment);
router.get('/khalti/verify', protect, verifyKhaltiOrderPayment);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
