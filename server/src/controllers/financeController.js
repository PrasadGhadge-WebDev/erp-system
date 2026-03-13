const Invoice = require('../models/finance/Invoice');
const Payment = require('../models/finance/Payment');

// @desc    Get all invoices
// @route   GET /api/finance/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({}).populate('sales_order_id', 'order_number');
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

// @desc    Create an invoice
// @route   POST /api/finance/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
  try {
    const {
      sales_order_id,
      invoice_number,
      invoice_date,
      due_date,
      total_amount,
      tax_amount,
      discount_amount,
    } = req.body;

    const invoice = await Invoice.create({
      sales_order_id,
      invoice_number,
      invoice_date,
      due_date,
      total_amount,
      tax_amount,
      discount_amount,
    });
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments
// @route   GET /api/finance/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({}).populate('invoice_id', 'invoice_number');
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a payment
// @route   POST /api/finance/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const { invoice_id, payment_method, transaction_reference, amount, payment_date, notes } =
      req.body;

    const payment = await Payment.create({
      invoice_id,
      payment_method,
      transaction_reference,
      amount,
      payment_date,
      notes,
    });

    // Update invoice status if fully paid (simplified logic)
    const invoice = await Invoice.findById(invoice_id);
    if (invoice) {
        // Here we ideally sum all payments, for now just marking paid if a payment is made
        invoice.status = 'paid';
        await invoice.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  createInvoice,
  getPayments,
  createPayment,
};
