const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
router.get('/search', productController.searchProduct)
router.get('/:productId', productController.renderProductPage)
module.exports = router