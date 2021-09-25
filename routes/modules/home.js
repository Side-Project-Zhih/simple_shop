const express = require('express')
const router = express.Router()
const productController = require('../../controllers/productController')
const sessionHelper = require('../../middleware/sessionHelper')

router.get(
  '/',
  sessionHelper.listWishlistPds,
  productController.renderIndexPage
)

module.exports = router
