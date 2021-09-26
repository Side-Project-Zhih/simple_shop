const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/adminController')

router.get('/', adminController.renderOrders)
router.get('/search', adminController.searchOrder)
router.get('/:id', adminController.editOrderPage)
router.post('/:id/check', adminController.checkOrderChange)
router.put('/:id', adminController.putOrder)

module.exports = router