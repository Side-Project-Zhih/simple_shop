const express = require('express')
const router = express.Router()
const order = require('./adminModules/order')
const category = require('./adminModules/category')
const product = require('./adminModules/products')
const { isAdmin, checkLogin } = require('../../middleware/auth')

router.use(checkLogin, isAdmin)
router.use('/orders',order)
router.use('/categories', category)
router.use('/products',product)

module.exports = router
