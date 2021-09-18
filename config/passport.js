const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const googleStrategy = require('passport-google-oauth20').Strategy
const fbStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ email }).then((user) => {
        if (!user) {
          return done(null, false, req.flash('warningMsg', '該帳戶不存在'))
        }
        const isMatch = bcrypt.compareSync(password, user.password)
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, req.flash('warning<sg', '密碼錯誤請重新輸入'))
      })
    }
  )
)
// passport.use(new googleStrategy({}))
// passport.use(new fbStrategy({}))

passport.serializeUser((user, done) => {
  return done(null, user._id)
})
passport.deserializeUser((userId, done) => {
  return User.findById(userId).then((user) => done(null, user))
})
module.exports = passport
