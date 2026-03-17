const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getUsers)
  .post(protect, authorize('admin', 'superadmin'), upload.single('profile_photo'), createUser);

router.patch('/:id/role', protect, authorize('superadmin'), updateUserRole);

module.exports = router;
