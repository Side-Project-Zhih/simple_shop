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
  }
}
