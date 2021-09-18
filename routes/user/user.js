const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')

//login
router.get('/login', userController.renderLoginPage)
router.post('/login')
//register
router.get('/register', userController.renderRegisterPage)
router.post('/register', userController.register)

module.exports = router