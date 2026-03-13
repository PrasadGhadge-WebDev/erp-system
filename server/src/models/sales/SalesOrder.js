const mongoose = require('mongoose');

const salesOrderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    order_number: { type: String, required: true, unique: true },
    order_date: { type: Date, required: true },
    total_amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax_amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('SalesOrder', salesOrderSchema);
