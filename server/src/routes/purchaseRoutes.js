const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  getPurchaseItems,
} = require('../controllers/purchaseController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/suppliers').get(protect, getSuppliers).post(protect, createSupplier);
router.route('/orders').get(protect, getPurchaseOrders).post(protect, createPurchaseOrder);
router.route('/items').get(protect, getPurchaseItems);

module.exports = router;
