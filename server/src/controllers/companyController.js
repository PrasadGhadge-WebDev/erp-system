const Company = require('../models/core/Company');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/Admin
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
const createCompany = async (req, res, next) => {
  try {
    const { company_name, email, phone, address, website, tax_number, status } = req.body;

    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      res.status(400);
      throw new Error('Company with this email already exists');
    }

    const company = new Company({
      company_name,
      email,
      phone,
      address,
      website,
      tax_number,
      status,
    });

    // Handle logo upload
    if (req.file) {
      company.logo = req.file.path.replace(/\\/g, '/');
    }

    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  createCompany,
};
