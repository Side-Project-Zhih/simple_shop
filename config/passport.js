const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const googleStrategy = require('passport-google-oauth20').Strategy
const fbStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')
let BaseUrl = process.env.BaseUrl || 'http://localhost:3000'
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email }).lean()
      if (!user) {
        return done(null, false, { message: '該帳戶不存在' })
      }
      const isMatch = bcrypt.compareSync(password, user.password)
      if (isMatch) {
        return done(null, user)
      }
      return done(null, false, { message: '密碼錯誤請重新輸入' })
    }
  )
)
passport.use(
  new googleStrategy(
    {
      clientID: process.env.googleClientId_login,
      clientSecret: process.env.googleClientSecret_login,
      callbackURL: `${BaseUrl}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json
      try {
        let user = await User.findOne({ email }).lean()
        if (user) {
          return done(null, user)
        }
        let password = Math.random().toString(36).slice(-8)
        user = await User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          isGoogle: true
        })
        return done(null, user)
      } catch (err) {
        console.log(err)
      }
    }
  )
)
passport.use(
  new fbStrategy(
    {
      clientID: process.env.facebookClientId,
      clientSecret: process.env.facebookClientSecret,
      callbackURL: `${BaseUrl}/auth/facebook/callback`,
      profileFields: ['email', 'displayName']
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json
      try {
        let user = await User.findOne({ email }).lean()
        if (user) {
          return done(null, user)
        }
        let password = Math.random().toString(36).slice(-8)
        user = await User.create({
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          isFb: true
        })
        return done(null, user)
      } catch (err) {
        console.log(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  return done(null, user._id)
})
passport.deserializeUser(async (userId, done) => {
  const user = await User.findById(userId).lean()
  return done(null, user)
})
module.exports = passport
