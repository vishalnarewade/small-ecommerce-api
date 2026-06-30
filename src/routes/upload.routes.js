const express = require('express')
const uploadController = require('../controllers/upload.controller')
const { uploadBulkExcel } = require('../middleware/upload.middleware')
const router = express.Router()

router.get('/products/sample', uploadController.downloadSample)
router.post('/products', uploadBulkExcel, uploadController.uploadProducts)

module.exports = router;
