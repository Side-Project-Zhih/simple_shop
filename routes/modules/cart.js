const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cartController')
router.get('/',cartController.renderCart)
router.post('/', cartController.postCart)
router.put('/',cartController.putCart)
router.delete('/', cartController.deleteCart)

module.exports = router
