const express = require('express')
const productController = require('../controllers/product.controller')
const { uploadProductImage } = require('../middleware/upload.middleware')
const router = express.Router()

router.get('/', productController.getProducts)
router.get('/:id', productController.getProductById)
router.post('/', uploadProductImage, productController.addProduct)
router.put('/:id', uploadProductImage, productController.updateProduct)
router.delete('/:id', productController.deleteProduct)

module.exports = router;
