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
router.get('/logout', userController.logout)
router.get('/:_id/validation/:email', userController.checkValidationMail)
router.post('/:_id/validation', userController.sendValidationMail)
router.get('/:_id', userController.renderUserProfile)
router.put('/:_id', userController.putUserProfile)
module.exports = router
