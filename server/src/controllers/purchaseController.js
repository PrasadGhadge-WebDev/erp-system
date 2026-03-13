const Supplier = require('../models/purchase/Supplier');
const PurchaseOrder = require('../models/purchase/PurchaseOrder');
const PurchaseItem = require('../models/purchase/PurchaseItem');

// @desc    Get all suppliers
// @route   GET /api/purchase/suppliers
// @access  Private
const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a supplier
// @route   POST /api/purchase/suppliers
// @access  Private
const createSupplier = async (req, res, next) => {
  try {
    const { company_name, contact_person, email, phone, address, city, country, tax_number, notes } =
      req.body;
    const supplier = await Supplier.create({
      company_name,
      contact_person,
      email,
      phone,
      address,
      city,
      country,
      tax_number,
      notes,
    });
    res.status(201).json(supplier);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all purchase orders
// @route   GET /api/purchase/orders
// @access  Private
const getPurchaseOrders = async (req, res, next) => {
  try {
    const orders = await PurchaseOrder.find({}).populate(
      'supplier_id',
      'company_name email'
    );
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a purchase order
// @route   POST /api/purchase/orders
// @access  Private
const createPurchaseOrder = async (req, res, next) => {
  try {
    const {
      supplier_id,
      order_number,
      order_date,
      expected_delivery_date,
      status,
      notes,
      items,
    } = req.body;

    const safeItems = Array.isArray(items) ? items : [];
    // Calculate total amount from items
    const total_amount = safeItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    const purchaseOrder = await PurchaseOrder.create({
      supplier_id,
      order_number,
      order_date,
      expected_delivery_date,
      total_amount,
      status,
      notes,
    });

    // Create Purchase Items
    if (safeItems.length > 0) {
      const purchaseItemsData = safeItems.map((item) => ({
        purchase_order_id: purchaseOrder._id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        total_price: item.quantity * item.price,
      }));
      await PurchaseItem.insertMany(purchaseItemsData);
    }

    res.status(201).json(purchaseOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get purchase items
// @route   GET /api/purchase/items
// @access  Private
const getPurchaseItems = async (req, res, next) => {
  try {
    const filter = req.query.order_id ? { purchase_order_id: req.query.order_id } : {};
    const items = await PurchaseItem.find(filter)
      .populate('purchase_order_id', 'order_number')
      .populate('product_id', 'product_name sku');
    res.json(items);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  getPurchaseItems,
};
