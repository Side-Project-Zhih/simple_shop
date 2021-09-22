const express = require('express')
const router = express.Router()
const passport = require('passport')
const adminController = require('../../controllers/adminController')
router.get('/login', adminController.renderLoginPage)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/orders',
    failureRedirect: '/admin/login'
  })
)
router.get('/orders')
module.exports = router
