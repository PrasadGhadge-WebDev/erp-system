const jwt = require('jsonwebtoken');
const User = require('../models/core/User'); // Will create this later

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized'));
    }

    // Populate role string from User's role_id reference
    await req.user.populate('role_id');

    if (!req.user.role_id || !roles.includes(req.user.role_id.role_name)) {
      res.status(403);
      return next(
        new Error(
          `User role ${req.user.role_id?.role_name} is not authorized to access this route`
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
