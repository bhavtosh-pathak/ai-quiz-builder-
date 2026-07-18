const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Verifies the JWT sent in the Authorization header (Bearer token)
 * and attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists or is deactivated');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired token');
  }
});

/**
 * Role-based access control. Usage: authorize('teacher') or authorize('teacher', 'student')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Access denied — requires role: ${allowedRoles.join(' or ')}`);
  }
  next();
};

module.exports = { protect, authorize };
