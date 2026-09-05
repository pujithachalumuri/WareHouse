const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    spaceRented: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    terms: { type: [String], default: [] },
    signedByCustomer: { type: Boolean, default: false },
    signedByOwner: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agreement', agreementSchema);
