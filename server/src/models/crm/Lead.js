const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    source: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'lost', 'won'],
      default: 'new',
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Lead', leadSchema);
