const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  getWarehouses,
  createWarehouse,
  getStockMovements,
  createStockMovement,
} = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/categories').get(protect, getCategories).post(protect, createCategory);
router.route('/products').get(protect, getProducts).post(protect, createProduct);
router.route('/warehouses').get(protect, getWarehouses).post(protect, createWarehouse);
router
  .route('/stock-movements')
  .get(protect, getStockMovements)
  .post(protect, createStockMovement);

module.exports = router;
