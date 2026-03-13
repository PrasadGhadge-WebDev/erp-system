const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    sales_order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalesOrder',
      required: true,
    },
    invoice_number: { type: String, required: true, unique: true },
    invoice_date: { type: Date, required: true },
    due_date: { type: Date },
    total_amount: { type: Number, required: true },
    tax_amount: { type: Number, default: 0 },
    discount_amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['unpaid', 'paid', 'overdue', 'cancelled'],
      default: 'unpaid',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
