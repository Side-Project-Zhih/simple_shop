const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
router.get('/products', adminController.renderProducts)
router.get('/products/search', adminController.searchProducts)
router.post(
  '/products/upload',
  upload.single('upload'),
  adminController.uploadImgFromDescription
)
router.get('/products/create', adminController.renderCreatePage)
router.get('/products/:id', adminController.editProductPage)
router.put('/products/:id', upload.single('pic'), adminController.putProduct)
router.delete('/products/:id', adminController.deleteProduct)
router.post('/products', upload.single('pic'), adminController.createProduct)
module.exports = router
