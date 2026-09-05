const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, default: '' },
    subject: { type: String, required: true },
    description: { type: String, default: '' },
    relatedTo: { type: String, default: '' },
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    resolution: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
