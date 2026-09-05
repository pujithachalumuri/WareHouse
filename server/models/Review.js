const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    targetType: { type: String, enum: ['warehouse', 'customer'], default: 'warehouse' },
    security: { type: Number, default: 0 },
    cleanliness: { type: Number, default: 0 },
    accessibility: { type: Number, default: 0 },
    facilities: { type: Number, default: 0 },
    overall: { type: Number, default: 0 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
