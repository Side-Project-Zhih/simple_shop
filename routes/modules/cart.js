const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cartController')
const { checkLogin } = require('../../middleware/auth')
router.use(checkLogin)
router.get('/:id', cartController.renderCart)
router.post('/', cartController.postCart)
router.put('/', cartController.putCart)
router.delete('/', cartController.deleteCart)

module.exports = router
