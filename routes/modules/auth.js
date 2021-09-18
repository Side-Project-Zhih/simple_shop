const express = require('express')
const router = express()
const passport = require('passport')
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

module.exports = router
