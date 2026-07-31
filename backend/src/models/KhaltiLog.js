const mongoose = require('mongoose');

// Pure audit trail of everything Khalti sends back to us. Not shown to users -
// this exists so admins/devs can look up exactly what the gateway said for a
// given payment, e.g. when debugging a stuck or disputed order.
const KhaltiLogSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  // Khalti's payment reference. May be null for a failed /initiate call that
  // never got as far as receiving a pidx back.
  pidx: {
    type: String,
    default: null,
  },
  // Which call this log entry came from
  event: {
    type: String,
    enum: ['initiate', 'lookup'],
    required: true,
  },
  // What we sent to Khalti
  requestPayload: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  // The raw, unmodified response body Khalti sent back (success or error)
  responsePayload: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  success: {
    type: Boolean,
    required: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('KhaltiLog', KhaltiLogSchema);
