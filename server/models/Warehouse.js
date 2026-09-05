const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    description: { type: String, default: '' },
    totalSpace: { type: Number, required: true },
    availableSpace: { type: Number, required: true },
    price: { type: Number, required: true },
    minimumDuration: { type: Number, default: 1 },
    storageType: {
      type: String,
      enum: ['Dry Storage', 'Cold Storage', 'Secure Vault', 'Open Yard', 'Controlled'],
      default: 'Dry Storage',
    },
    warehouseType: {
      type: String,
      enum: ['Partial', 'Full', 'Shared', 'Multi-tenant'],
      default: 'Partial',
    },
    facilities: { type: [String], default: [] },
    security: { type: [String], default: [] },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
    availableFrom: { type: Date, default: Date.now },
    availableTo: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Warehouse', warehouseSchema);
