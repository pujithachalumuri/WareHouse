const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    type: {
      type: String,
      enum: [
        'booking-request',
        'booking-approved',
        'booking-rejected',
        'payment-reminder',
        'agreement-generated',
        'agreement-expiry',
        'warehouse-verification',
        'access-granted',
        'access-denied',
        'inventory-alert',
        'rental-expiry',
        'system',
      ],
      default: 'system',
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
