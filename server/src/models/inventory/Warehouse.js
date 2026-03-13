const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    warehouse_name: { type: String, required: true },
    location: { type: String },
    manager_name: { type: String },
    contact_number: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Warehouse', warehouseSchema);
