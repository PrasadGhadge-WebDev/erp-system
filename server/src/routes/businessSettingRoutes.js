const express = require('express');
const router = express.Router();
const {
  getBusinessSettings,
  upsertBusinessSettings,
} = require('../controllers/businessSettingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getBusinessSettings)
  .post(protect, authorize('admin', 'superadmin'), upsertBusinessSettings);

module.exports = router;
