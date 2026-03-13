const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    payment_method: { type: String, required: true }, // e.g., 'credit_card', 'bank_transfer', 'cash'
    transaction_reference: { type: String },
    amount: { type: Number, required: true },
    payment_date: { type: Date, required: true },
    notes: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

module.exports = mongoose.model('Payment', paymentSchema);
