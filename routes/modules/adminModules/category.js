const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/adminController')

router.get('/categories', adminController.renderCategories)
router.post('/categories', adminController.createCategory)
router.put('/categories/:id', adminController.putCategory)
router.delete('/categories/:id', adminController.deleteCategory)

module.exports = router
