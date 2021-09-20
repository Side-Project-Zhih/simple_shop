const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const sessionHelper = require('../../middleware/sessionHelper')
router.get(
  '/search',
  sessionHelper.listWishlistPds,
  productController.searchProduct
)
router.get(
  '/:productId',
  sessionHelper.listWishlistPds,
  productController.renderProductPage
)
module.exports = router
