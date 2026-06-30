const express = require('express')
const reportController = require('../controllers/report.controller')
const router = express.Router()

router.get('/products', reportController.getProducts)
router.get('/summary', reportController.getSummary)
router.get('/export/excel', reportController.getExportExcel)

module.exports = router;