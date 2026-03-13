const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    department_name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Department', departmentSchema);
