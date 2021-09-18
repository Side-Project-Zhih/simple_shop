const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const passport = require('passport')
//login
router.get('/login', userController.renderLoginPage)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)
//register
router.get('/register', userController.renderRegisterPage)
router.post('/register', userController.register)

module.exports = router
