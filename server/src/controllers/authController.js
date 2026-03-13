const jwt = require('jsonwebtoken');
const User = require('../models/core/User');
const Role = require('../models/core/Role'); // Needed to check roles if necessary
const Company = require('../models/core/Company');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role_id').populate('company_id');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id.role_name,
        company: user.company_id.company_name,
        token: generateToken(user._id),
      });

      // Update last login
      user.last_login = Date.now();
      await user.save();
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('role_id').populate('company_id');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role_id,
        company: user.company_id,
        profile_photo: user.profile_photo,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, company_name, phone } = req.body;

    if (!name || !email || !password || !company_name) {
      res.status(400);
      throw new Error('Name, email, password, and company name are required');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    let company =
      (await Company.findOne({ email })) ||
      (await Company.findOne({ company_name }));

    if (!company) {
      company = await Company.create({
        company_name,
        email,
        phone,
        status: 'active',
      });
    }

    let role = await Role.findOne({ role_name: 'admin' });
    if (!role) {
      role = await Role.create({
        role_name: 'admin',
        description: 'Default admin role',
      });
    }

    const user = await User.create({
      company_id: company._id,
      role_id: role._id,
      name,
      email,
      phone,
      password,
      status: 'active',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role.role_name,
      company: company.company_name,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  getUserProfile,
  registerUser,
};
