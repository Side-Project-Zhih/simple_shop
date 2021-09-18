const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const auth = require('./modules/auth')
router.get('/', (req, res) => {
  res.render('index')
})
router.use('/auth', auth)
router.use('/users', user)

module.exports = router
