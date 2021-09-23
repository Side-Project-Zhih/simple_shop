const express = require('express')
const router = express.Router()
const passport = require('passport')
const adminController = require('../../controllers/adminController')
const { isAdmin, checkLogin } = require('../../middleware/auth')
// router.use(checkLogin, isAdmin)
router.get('/orders',adminController.renderOrders)
module.exports = router
