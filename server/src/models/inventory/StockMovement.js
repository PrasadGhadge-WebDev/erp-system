const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    warehouse_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    movement_type: {
      type: String,
      enum: ['in', 'out', 'transfer', 'adjustment'],
      required: true,
    },
    quantity: { type: Number, required: true },
    reference_type: { type: String }, // e.g., 'purchase_order', 'sales_order'
    reference_id: { type: mongoose.Schema.Types.ObjectId }, // ID of the referenced document
    notes: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);
