const Role = require('../models/core/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({});
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a role
// @route   POST /api/roles
// @access  Private/Admin
const createRole = async (req, res, next) => {
  try {
    const { role_name, description } = req.body;

    const roleExists = await Role.findOne({ role_name });
    if (roleExists) {
      res.status(400);
      throw new Error('Role already exists');
    }

    const role = await Role.create({ role_name, description });
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  createRole,
};
