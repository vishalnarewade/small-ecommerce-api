const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({ message: 'Not authorized, token payload missing user id' });
    }

    req.user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'status'],
      raw: true
    });

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.status)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }

  next();
};

module.exports = { protect, authorizeRoles };
