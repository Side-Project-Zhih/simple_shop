const express = require('express')
const router = express.Router()
const wishlistController = require('../../controllers/wishlistController')
router.get('/', wishlistController.renderWishlistPage)
router.put('/', wishlistController.putWishlist)
router.post('/', wishlistController.postWishlist)

module.exports = router
