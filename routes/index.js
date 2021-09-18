const express = require('express')
const router = express.Router()
const user = require('./user/user')
router.get('/', (req, res) => {
  res.render('index')
})
router.use('/users', user)

module.exports = router
