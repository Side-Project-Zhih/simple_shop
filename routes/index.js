const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const auth = require('./modules/auth')
const home = require('./modules/home')
router.use('/auth', auth)
router.use('/users', user)
router.use('/', home)

module.exports = router
