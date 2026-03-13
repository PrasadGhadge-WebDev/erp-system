const Customer = require('../models/crm/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find({ company_id: req.user.company_id });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      alternate_phone,
      address,
      city,
      state,
      country,
      postal_code,
      customer_type,
      notes,
    } = req.body;

    const customer = new Customer({
      company_id: req.user.company_id,
      name,
      email,
      phone,
      alternate_phone,
      address,
      city,
      state,
      country,
      postal_code,
      customer_type,
      notes,
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  createCustomer,
};
