const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/orderController')
router.get('/:id', orderController.renderOrderPage)
router.post('/', orderController.postOrder)
router.delete('/:id', (orderController.cancelOrder))

module.exports = router