const express = require('express');
const router = express.Router();
const { getCompanies, createCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getCompanies)
  .post(protect, authorize('superadmin'), upload.single('logo'), createCompany);

module.exports = router;
