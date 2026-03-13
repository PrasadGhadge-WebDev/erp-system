const ActivityLog = require('../models/core/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activity-logs
// @access  Private/Admin
const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({})
      .populate('user_id', 'name email')
      .sort({ created_at: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
};
