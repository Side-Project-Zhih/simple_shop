const express = require('express')
const router = express.Router()
const passport = require('passport')
const adminController = require('../../controllers/adminController')
router.get('/orders', (req, res)=> {
  res.send('ddddd')
})
module.exports = router
