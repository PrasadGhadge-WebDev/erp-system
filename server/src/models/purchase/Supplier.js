const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    contact_person: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    tax_number: { type: String },
    notes: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Supplier', supplierSchema);
