const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/orderController')
const { checkLogin, checkOrderBelongToOwner } = require('../../middleware/auth')


router.post('/payment/callback', orderController.payOrder)
router.use(checkLogin)
router.post('/', orderController.postOrder)

router.get('/:id',checkOrderBelongToOwner, orderController.renderOrderPage)
router.delete('/:id', checkOrderBelongToOwner,(orderController.cancelOrder))


module.exports = router