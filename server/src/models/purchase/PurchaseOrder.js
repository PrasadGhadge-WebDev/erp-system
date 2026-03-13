const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    order_number: { type: String, required: true, unique: true },
    order_date: { type: Date, required: true },
    expected_delivery_date: { type: Date },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'ordered', 'received', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
