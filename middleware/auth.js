const passport = require('passport')
module.exports = {
  checkLoginAndOwner: (req, res, next) => {
    let visitUserId = req.params._id
    if (req.isAuthenticated()) {
      if (visitUserId !== req.user._id.toString()) {
        return res.redirect('back')
      }
      return next()
    }
    req.flash('warningMsg', '請先登入')
    return res.redirect('/users/login')
  },
  checkLogin: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warningMsg', '請先登入')
    return res.redirect('/users/login')
  },
  checkOrderBelongToOwner: (req, res, next) => {
    let orders = req.user.orders
    let orderId = req.params.id
    if (!orders[orderId]) {
      return res.redirect('back')
    }
    return next()
  },
  isValidAccount: (req, res, next) => {
    if (req.user.isValid) {
      return next()
    }
    req.flash('warningMsg', '請至個人資料進行帳號email驗證')
    return res.redirect('back')
  },
  localAuthenticate: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (info) {
        req.flash('warningMsg', info.message)
        return res.redirect('/users/login')
      }
      if (user) {
        req.logIn(user, function (err) {
          if (err) {
            return next(err)
          }
          if (user.role === 'admin') {
            return res.redirect('/admin/orders')
          } else {
            return res.redirect('/')
          }
        })
      }
    })(req, res, next)
  }
}
