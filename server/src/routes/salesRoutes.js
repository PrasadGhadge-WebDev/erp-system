const express = require('express');
const router = express.Router();
const { getSalesOrders, createSalesOrder, getSalesItems } = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/orders').get(protect, getSalesOrders).post(protect, createSalesOrder);
router.route('/items').get(protect, getSalesItems);

module.exports = router;
