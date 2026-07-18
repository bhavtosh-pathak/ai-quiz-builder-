const jwt = require('jsonwebtoken');

/**
 * Signs a JWT carrying the user's id and role.
 * Role is embedded so the frontend/socket layer can make quick
 * client-side decisions without an extra lookup (server still
 * re-verifies role on every protected route).
 */
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = generateToken;
