const express = require('express')
const router = express.Router()

const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes')
const reportRoutes = require('./report.routes')
const categoriesRoutes = require('./category.routes')
const uploadRoutes = require('./upload.routes')
const authRoutes = require('./auth.routes');
const { protect } = require('../middleware/auth.middleware');

router.use('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/users', protect, userRoutes);
router.use('/product', protect, productRoutes);
router.use('/report', protect, reportRoutes);
router.use('/category', protect, categoriesRoutes);
router.use('/upload', protect, uploadRoutes);
router.use('/auth', authRoutes);

module.exports = router;
