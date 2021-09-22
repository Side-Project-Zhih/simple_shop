const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const orderController = require('../../controllers/orderController')
const {
  checkLogin,
  checkOwner,
  localAuthenticate,
  isUser
} = require('../../middleware/auth')

//login
router.get('/login', userController.renderLoginPage)
router.post('/login', localAuthenticate)
//register
router.get('/register', userController.renderRegisterPage)
router.post('/register', userController.register)
router.get('/logout', userController.logout)

router.use(checkLogin, isUser)
router.get(
  '/:_id/validation/:email',
  checkOwner,
  userController.checkValidationMail
)
router.post('/:_id/validation', checkOwner, userController.sendValidationMail)
router.get('/:_id/orders', checkOwner, orderController.getOrders)
router.get('/:_id', checkOwner, userController.renderUserProfile)
router.put('/:_id', checkOwner, userController.putUserProfile)
module.exports = router
