const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/adminController')

router.get('/', adminController.renderCategories)
router.post('/', adminController.createCategory)
router.put('/:id', adminController.putCategory)
router.delete('/:id', adminController.deleteCategory)

module.exports = router
