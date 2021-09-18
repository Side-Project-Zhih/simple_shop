const bcrypt = require('bcryptjs')
const User = require('../models/user')
const mailer = require('../config/mailer')
module.exports = {
  renderLoginPage: (req, res) => {
    res.render('login')
  },
  login: (req, res) => {},
  renderRegisterPage: (req, res) => {
    res.render('register')
  },
  register: (req, res) => {
    const { email, name, password, passwordCheck } = req.body
    //確認email格式
    const emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    // console.log(emailRule.test(email))
    if (!emailRule.test(email)) {
      req.flash('warningMsg', 'email格式錯誤')
      return res.render('back')
    }
    //確認密碼
    if (password !== passwordCheck) {
      req.flash('warningMsg', '密碼與確認密碼不一致')
      return res.redirect('back')
    }
    const passwordRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/
    if (passwordRule.test(passwordRule)) {
      req.flash('warningMsg', '密碼不符合格式')
      return res.redirect('back')
    }
    User.exists({ email })
      .then((isExist) => {
        if (isExist) {
          req.flash('warningMsg', '此帳戶已被使用')
          return res.redirect('back')
        }

        return User.create({
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
          name
        }).then((user) => {
          return mailer.sendMail({
            from: process.env.googleAccount,
            to: 'fufong79570@gmail.com',
            html: `<h2>請點以下連結完成驗證</h2><br>
            <a href="http://locahost:3000/users/${user.email}">連結</a>
            `
          })
        }).then(async () => {
          req.flash('successMsg', '帳戶建立成功，稍後請進行email驗證')
          return res.redirect('/users/login')
        })
      })
      .catch((err) => console.log(error))
  }
}
