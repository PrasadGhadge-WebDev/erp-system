const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    website: { type: String },
    tax_number: { type: String },
    logo: { type: String }, // Path to logo file
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Company', companySchema);
