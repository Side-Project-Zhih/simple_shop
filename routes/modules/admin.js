const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
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
router.post('/products/upload',upload.single('upload'), (req, res) => {
  console.log(req.file)
})
router.get('/products/:id', adminController.editProductPage)
router.put('/products/:id', upload.single('pic'), adminController.putProduct)

router.get('/categories', adminController.renderCategories)
router.post('/categories', adminController.createCategory)
router.put('/categories/:id', adminController.putCategory)
router.delete('/categories/:id', adminController.deleteCategory)



module.exports = router
