const Category = require('../models/inventory/Category');
const Product = require('../models/inventory/Product');
const Warehouse = require('../models/inventory/Warehouse');
const StockMovement = require('../models/inventory/StockMovement');

// @desc    Get all categories
// @route   GET /api/inventory/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/inventory/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/inventory/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).populate('category_id', 'name');
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/inventory/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const {
      category_id,
      product_name,
      sku,
      barcode,
      description,
      cost_price,
      selling_price,
      stock_quantity,
      minimum_stock,
      unit,
    } = req.body;

    const product = await Product.create({
      category_id,
      product_name,
      sku,
      barcode,
      description,
      cost_price,
      selling_price,
      stock_quantity,
      minimum_stock,
      unit,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all warehouses
// @route   GET /api/inventory/warehouses
// @access  Private
const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find({});
    res.json(warehouses);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a warehouse
// @route   POST /api/inventory/warehouses
// @access  Private
const createWarehouse = async (req, res, next) => {
  try {
    const { warehouse_name, location, manager_name, contact_number } = req.body;
    const warehouse = await Warehouse.create({
      warehouse_name,
      location,
      manager_name,
      contact_number,
    });
    res.status(201).json(warehouse);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stock movements
// @route   GET /api/inventory/stock-movements
// @access  Private
const getStockMovements = async (req, res, next) => {
  try {
    const stockMovements = await StockMovement.find({})
      .populate('product_id', 'product_name sku')
      .populate('warehouse_id', 'warehouse_name');
    res.json(stockMovements);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a stock movement
// @route   POST /api/inventory/stock-movements
// @access  Private
const createStockMovement = async (req, res, next) => {
  try {
    const {
      product_id,
      warehouse_id,
      movement_type,
      quantity,
      reference_type,
      reference_id,
      notes,
    } = req.body;

    const stockMovement = await StockMovement.create({
      product_id,
      warehouse_id,
      movement_type,
      quantity,
      reference_type,
      reference_id,
      notes,
    });
    res.status(201).json(stockMovement);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  getWarehouses,
  createWarehouse,
  getStockMovements,
  createStockMovement,
};
