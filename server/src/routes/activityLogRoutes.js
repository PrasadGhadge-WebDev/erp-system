const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/').get(protect, authorize('admin', 'superadmin'), getActivityLogs);

module.exports = router;
