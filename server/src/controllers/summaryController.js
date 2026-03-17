const Customer = require('../models/crm/Customer');
const Lead = require('../models/crm/Lead');
const Product = require('../models/inventory/Product');
const Warehouse = require('../models/inventory/Warehouse');
const Supplier = require('../models/purchase/Supplier');
const PurchaseOrder = require('../models/purchase/PurchaseOrder');
const SalesOrder = require('../models/sales/SalesOrder');
const Invoice = require('../models/finance/Invoice');
const Payment = require('../models/finance/Payment');
const Employee = require('../models/hr/Employee');
const Department = require('../models/hr/Department');
const Company = require('../models/core/Company');
const User = require('../models/core/User');

const getSummary = async (req, res, next) => {
  try {
    const [
      customers,
      leads,
      products,
      warehouses,
      suppliers,
      purchaseOrders,
      salesOrders,
      invoices,
      payments,
      employees,
      departments,
      companies,
      users,
    ] = await Promise.all([
      Customer.countDocuments(),
      Lead.countDocuments(),
      Product.countDocuments(),
      Warehouse.countDocuments(),
      Supplier.countDocuments(),
      PurchaseOrder.countDocuments(),
      SalesOrder.countDocuments(),
      Invoice.countDocuments(),
      Payment.countDocuments(),
      Employee.countDocuments(),
      Department.countDocuments(),
      Company.countDocuments(),
      User.countDocuments(),
    ]);

    const [salesTotals, purchaseTotals, invoiceTotals, paymentTotals] =
      await Promise.all([
        SalesOrder.aggregate([
          { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
        PurchaseOrder.aggregate([
          { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
        Invoice.aggregate([
          { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
        Payment.aggregate([
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
      ]);

    res.json({
      counts: {
        customers,
        leads,
        products,
        warehouses,
        suppliers,
        purchase_orders: purchaseOrders,
        sales_orders: salesOrders,
        invoices,
        payments,
        employees,
        departments,
        companies,
        users,
      },
      totals: {
        sales: salesTotals[0]?.total || 0,
        purchases: purchaseTotals[0]?.total || 0,
        invoices: invoiceTotals[0]?.total || 0,
        payments: paymentTotals[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummary };
