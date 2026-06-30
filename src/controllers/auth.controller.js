const User = require("../models/user.model");
const generateToken = require('../utils/jwt');

const stripUnsafeChars = (value = '') =>
  value
    .replace(/<[^>]*>?/gm, '')
    .replace(/[^\w\s.'-]/g, '')
    .trim();

const register = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password_hash = String(req.body.password || '');
  const status = String(req.body.status || '').trim().toLowerCase();

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ email, password_hash, status });
  const userData = user.get({ plain: true });
  const token = generateToken({ id: userData.id, status: userData.status });

  return res.status(201).json({
    token,
    user: { id: userData.id, email: userData.email, status: userData.status }
  });
};

const login = async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  const user = await User.findOne({ where:{ email } });
  
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const userData = user.get({ plain: true });
  const token = generateToken({ id: userData.id, status: userData.status });

  return res.json({
    token,
    user: { id: userData.id, email: userData.email, status: userData.status }
  });
};

module.exports = { login, register };
