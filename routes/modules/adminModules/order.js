const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/adminController')

router.get('/orders', adminController.renderOrders)
router.get('/orders/search', adminController.searchOrder)
router.get('/orders/:id', adminController.editOrderPage)
router.post('/orders/:id/check', adminController.checkOrderChange)
router.put('/orders/:id', adminController.putOrder)

module.exports = router