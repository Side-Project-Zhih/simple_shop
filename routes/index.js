const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const auth = require('./modules/auth')
const home = require('./modules/home')
const product = require('./modules/product')
const wishlist = require('./modules/wishlist')
router.use('/auth', auth)
router.use('/users', user)
router.use('/wishlist', wishlist)
router.use('/products', product)
router.use('/', home)

module.exports = router
