const SalesOrder = require('../models/sales/SalesOrder');
const SalesItem = require('../models/sales/SalesItem');

// @desc    Get all sales orders
// @route   GET /api/sales/orders
// @access  Private
const getSalesOrders = async (req, res, next) => {
  try {
    const orders = await SalesOrder.find({}).populate('customer_id', 'name email');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a sales order
// @route   POST /api/sales/orders
// @access  Private
const createSalesOrder = async (req, res, next) => {
  try {
    const {
      customer_id,
      order_number,
      order_date,
      items,
      discount = 0,
      tax_amount = 0,
      notes,
    } = req.body;

    const safeItems = Array.isArray(items) ? items : [];
    // Calculate total amount from items
    const items_total = safeItems.reduce(
      (acc, item) => acc + item.quantity * item.price - (item.discount || 0),
      0
    );

    const total_amount = items_total + tax_amount - discount;

    const salesOrder = await SalesOrder.create({
      customer_id,
      order_number,
      order_date,
      total_amount,
      discount,
      tax_amount,
      notes,
    });

    // Create Sales Items
    if (safeItems.length > 0) {
      const salesItemsData = safeItems.map((item) => ({
        sales_order_id: salesOrder._id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        total_price: item.quantity * item.price - (item.discount || 0),
      }));
      await SalesItem.insertMany(salesItemsData);
    }

    res.status(201).json(salesOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales items
// @route   GET /api/sales/items
// @access  Private
const getSalesItems = async (req, res, next) => {
  try {
    const filter = req.query.order_id ? { sales_order_id: req.query.order_id } : {};
    const items = await SalesItem.find(filter)
      .populate('sales_order_id', 'order_number')
      .populate('product_id', 'product_name sku');
    res.json(items);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesOrders,
  createSalesOrder,
  getSalesItems,
};
