const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, default: '' },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    warehouseName: { type: String, default: '' },
    accessType: { type: String, enum: ['entry', 'exit'], default: 'entry' },
    status: { type: String, enum: ['granted', 'denied'], default: 'granted' },
    method: { type: String, enum: ['face', 'manual', 'qr'], default: 'face' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AccessLog', accessLogSchema);
