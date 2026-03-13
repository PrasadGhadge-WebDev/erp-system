const express = require('express');
const router = express.Router();
const { getRoles, createRole } = require('../controllers/roleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getRoles)
  .post(protect, authorize('superadmin'), createRole);

module.exports = router;
