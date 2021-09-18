const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const googleStrategy = require('passport-google-oauth20').Strategy
const fbStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
// passport.use(new LocalStrategy({
  
// }))
// passport.use(new googleStrategy({}))
// passport.use(new fbStrategy({}))


passport.serializeUser((user, done) => {
  return done(null, user._id) 
})
passport.deserializeUser((userId, done) => {
  return User.findById(userId)
  .then(user => done(null, user))
})

module.exports = passport