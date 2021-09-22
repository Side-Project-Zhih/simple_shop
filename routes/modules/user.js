const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const orderController = require('../../controllers/orderController')
const passport = require('passport')
const {
  checkLoginAndOwner,
  localAuthenticate
} = require('../../middleware/auth')

//login
router.get('/login', userController.renderLoginPage)
router.post('/login', localAuthenticate)
//register
router.get('/register', userController.renderRegisterPage)
router.post('/register', userController.register)
router.get('/logout', userController.logout)

router.get(
  '/:_id/validation/:email',
  checkLoginAndOwner,
  userController.checkValidationMail
)
router.post(
  '/:_id/validation',
  checkLoginAndOwner,
  userController.sendValidationMail
)
router.get('/:_id/orders', checkLoginAndOwner, orderController.getOrders)
router.get('/:_id', checkLoginAndOwner, userController.renderUserProfile)
router.put('/:_id', checkLoginAndOwner, userController.putUserProfile)
module.exports = router
