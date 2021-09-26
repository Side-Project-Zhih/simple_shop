const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/adminController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
router.get('/', adminController.renderProducts)
router.get('/search', adminController.searchProducts)
router.post(
  '/upload',
  upload.single('upload'),
  adminController.uploadImgFromDescription
)
router.get('/create', adminController.renderCreatePage)
router.get('/:id', adminController.editProductPage)
router.put('/:id', upload.single('pic'), adminController.putProduct)
router.delete('/:id', adminController.deleteProduct)
router.post('/', upload.single('pic'), adminController.createProduct)
module.exports = router
