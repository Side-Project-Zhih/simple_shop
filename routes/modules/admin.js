const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { isAdmin, checkLogin } = require('../../middleware/auth')
// router.use(checkLogin, isAdmin)
router.get('/orders', adminController.renderOrders)
router.get('/orders/search', adminController.searchOrder)
router.get('/orders/:id', adminController.editOrderPage)
router.post('/orders/:id/check', adminController.checkOrderChange)
router.put('/orders/:id', adminController.putOrder)

router.get('/products', adminController.renderProducts)
router.get('/products/search', adminController.searchProducts)
router.get('/products/:id', adminController.editProductPage)
router.put('/products/:id', (req, res) => {
  console.log(req.body)
})
module.exports = router
