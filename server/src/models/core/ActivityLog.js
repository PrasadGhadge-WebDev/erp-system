const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    module_name: { type: String, required: true },
    action: { type: String, required: true },
    description: { type: String },
    ip_address: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
