const bcrypt = require('bcryptjs')
const User = require('../models/user')
const mailer = require('../config/mailer')
const helper = require('../helper/helper')
const cardValidator = require('card-validator')
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
        })
          .then((user) => {
            return mailer.sendMail({
              from: process.env.googleAccount,
              to: 'fufong79570@gmail.com',
              subject: 'MY SHOP 帳號驗證信',
              html: `<h2>請點以下連結完成驗證</h2><br>
            <a href="http://localhost:3000/users/${_id}/validation/${user.email.toString()}">連結</a>
            `
            })
          })
          .then(async () => {
            req.flash('successMsg', '帳戶建立成功，稍後請進行email驗證')
            return res.redirect('/users/login')
          })
      })
      .catch((err) => console.log(error))
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  renderUserProfile: (req, res) => {
    const renderObj = helper.getProfilePart(req.query)
    res.render('profile', renderObj)
  },
  putUserProfile: async (req, res) => {
    const _id = req.params._id
    const user = req.user
    if (user._id.toString() !== _id) {
      return res.redirect('back')
    }
    const { password, newPassword, checkPassword } = req.body
    const { cardNumber, expYear, expMon } = req.body
    const { name, address, mailNum, phone } = req.body
    //基本訊息
    if (name && address && mailNum && phone) {
      await User.findOneAndUpdate(
        { _id },
        {
          name,
          address,
          mailNum,
          phone
        }
      )
      req.flash('successMsg', '基本訊息更改成功')
      return res.redirect('back')
    }
    //密碼處理
    if (password) {
      const isMatch = bcrypt.compareSync(password, user.password.toString())
      if (!isMatch) {
        req.flash('warningMsg', '密碼錯誤')
        return res.redirect('back')
      }
      if (isMatch) {
        if (newPassword !== checkPassword) {
          req.flash('warningMsg', '密碼與確認密碼不一致')
          return res.redirect(back)
        }
        const hashPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync(10)
        )
        await User.findOneAndUpdate({ _id }, { password: hashPassword })
        req.flash('successMsg', '密碼更改成功')
        return res.redirect('back')
      }
    }
    //信用卡處理
    let result = cardValidator.number(cardNumber)
    if (result.isValid) {
      await User.findOneAndUpdate(
        { _id },
        {
          creditCard: {
            cardNumber,
            expMon,
            expYear
          }
        }
      )
      req.flash('successMsg', '信用卡卡號更改成功')
      return res.redirect('back')
    }
    if (!result.isValid) {
      req.flash('warningMsg', '信用卡卡號錯誤')
      return res.redirect('back')
    }

    req.flash('warning', '請勿填寫每一個欄位')
    return res.redirect('back')
  },
  sendValidationMail: async (req, res) => {
    const _id = req.params._id
    const user = req.user
    if (user._id.toString() !== _id) {
      return res.redirect('back')
    }
    let mail
    let validMail = {
      from: process.env.googleAccount,
      to: 'fufong79570@gmail.com',
      subject: 'MY SHOP 帳號驗證信',
      html: `<h2>請點以下連結完成驗證</h2><br>
            <a href="http://localhost:3000/users/${_id}/validation/${user.email.toString()}">連結</a>
            `
    }
    let info = await mailer
      .sendMail(validMail)
      .catch((error) => console.log(error))
    req.flash('successMsg', '已發送驗證信')
    res.redirect('back')
  },
  checkValidationMail: async (req, res) => {
    let email = req.params.email
    const user = req.user
    if (user.email.toString() !== email) {
      return res.render('mailValid')
    }
    await User.findOneAndUpdate({ email }, { isValid: true })
    res.render('mailValid',{isValid:true})
  }
}
