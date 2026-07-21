const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'khalti'],
    default: 'cod',
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid',
  },
  // Khalti's payment identifier for this order, used to verify status via the lookup API
  khaltiPidx: {
    type: String,
    default: null,
  },
  // Khalti's transaction id, only set once payment is confirmed as Completed
  khaltiTransactionId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
