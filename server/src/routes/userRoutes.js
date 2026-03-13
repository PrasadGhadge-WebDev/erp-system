const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getUsers)
  .post(protect, authorize('admin', 'superadmin'), upload.single('profile_photo'), createUser);

module.exports = router;
