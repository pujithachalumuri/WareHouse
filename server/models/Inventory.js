const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    productName: { type: String, required: true, trim: true },
    sku: { type: String, default: '' },
    category: { type: String, default: '' },
    quantity: { type: Number, required: true, default: 0 },
    rack: { type: String, default: '' },
    expiryDate: { type: Date, default: null },
    lowStockThreshold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);
