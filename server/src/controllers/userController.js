const User = require('../models/core/User');
const Role = require('../models/core/Role'); // For creating user with roles
const ActivityLog = require('../models/core/ActivityLog');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .populate('role_id', 'role_name')
      .populate('company_id', 'company_name')
      .select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { company_id, role_id, name, email, phone, password, status } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = new User({
      company_id,
      role_id,
      name,
      email: normalizedEmail,
      phone,
      password,
      status,
    });

    if (req.file) {
      user.profile_photo = req.file.path.replace(/\\/g, '/');
    }

    const createdUser = await user.save();

    // Log the activity
    await ActivityLog.create({
      user_id: req.user._id,
      module_name: 'Core',
      action: 'Create User',
      description: `User ${createdUser.name} created`,
      ip_address: req.ip,
    });

    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's role
// @route   PATCH /api/users/:id/role
// @access  Private/SuperAdmin
const updateUserRole = async (req, res, next) => {
  try {
    const { role_id } = req.body;

    if (!role_id) {
      res.status(400);
      throw new Error('Role is required');
    }

    const role = await Role.findById(role_id);
    if (!role) {
      res.status(404);
      throw new Error('Role not found');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.role_id = role_id;
    await user.save();

    await ActivityLog.create({
      user_id: req.user._id,
      module_name: 'Core',
      action: 'Update User Role',
      description: `Role updated for user ${user.name}`,
      ip_address: req.ip,
    });

    const updatedUser = await User.findById(user._id)
      .populate('role_id', 'role_name')
      .populate('company_id', 'company_name')
      .select('-password');

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserRole,
};
