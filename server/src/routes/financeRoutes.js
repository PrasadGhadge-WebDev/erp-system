const express = require('express');
const router = express.Router();
const {
  getInvoices,
  createInvoice,
  getPayments,
  createPayment,
} = require('../controllers/financeController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/invoices').get(protect, getInvoices).post(protect, createInvoice);
router.route('/payments').get(protect, getPayments).post(protect, createPayment);

module.exports = router;
