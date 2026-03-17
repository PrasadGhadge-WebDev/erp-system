const jwt = require('jsonwebtoken');
const User = require('../models/core/User');
const Role = require('../models/core/Role'); // Needed to check roles if necessary
const Company = require('../models/core/Company');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

const normalizeEmail = (value) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const normalizeString = (value) =>
  typeof value === 'string' ? value.trim() : '';

const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

const isStrongPassword = (value) =>
  typeof value === 'string' && value.length >= 8;

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password || '';

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error('Invalid email address');
    }

    const user = await User.findOne({ email })
      .select('+password')
      .populate('role_id')
      .populate('company_id');

    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'active') {
        res.status(403);
        throw new Error('User account is not active');
      }

      if (!user.role_id || !user.company_id) {
        res.status(403);
        throw new Error('User role or company is not configured');
      }

      user.last_login = new Date();
      await user.save({ validateBeforeSave: false });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id?.role_name || null,
        company: user.company_id?.company_name || null,
        token: generateToken(user._id),
      });
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
        role: user.role_id?.role_name || null,
        company: user.company_id?.company_name || null,
        profile_photo: user.profile_photo,
        status: user.status,
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
    const name = normalizeString(req.body.name);
    const email = normalizeEmail(req.body.email);
    const password = req.body.password || '';
    const company_name = normalizeString(req.body.company_name);
    const phone = normalizeString(req.body.phone);

    if (!name || !email || !password || !company_name) {
      res.status(400);
      throw new Error('Name, email, password, and company name are required');
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error('Invalid email address');
    }

    if (!isStrongPassword(password)) {
      res.status(400);
      throw new Error('Password must be at least 8 characters');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    let company = await Company.findOne({
      $or: [{ email }, { company_name }],
    });

    if (!company) {
      company = await Company.create({
        company_name,
        email,
        phone: phone || undefined,
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
      phone: phone || undefined,
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
