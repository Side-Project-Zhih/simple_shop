const Cart = require('../models/cart')
const Product = require('../models/product')
const User = require('../models/user')
module.exports = {
  renderCart: async (req, res) => {
    let cartId = req.session.cart
    const user = req.user
    let products = []
    let totalPrice = 0
    if (req.isAuthenticated()) {
      cartId = user.cart
    }

    if (cartId) {
      let cart = await Cart.findById(cartId)
        .populate('pdsInfo', '_id name price pic')
        .lean()
      let pds = cart.pds
      products = cart.pdsInfo
      totalPrice = cart.totalPrice
      products.forEach((pd) => {
        pd.num = pds[pd._id]
        pd.totalPrice = pds[pd._id] * pd.price
      })
    }
    const renderData = { title: '購物車', products, totalPrice }
    res.render('carts', renderData)
  },
  postCart: async (req, res) => {
    let cartId = req.session.cart
    const user = req.user
    const pdId = req.body.id
    let num = +req.body.num
    let pd = await Product.findById(pdId).lean()
    if (!num) {
      req.flash('warningMsg', '數量不可空白')
      return res.redirect('back')
    }
    let totalPriceOfNewAdd = pd.price * num
    let pds = {}
    let pdsInfo = [pdId]
    pds[pd._id] = num
    // 登入狀態
    if (req.isAuthenticated()) {
      //session 未存cartID
      if (!user.cart && !cartId) {
        let cart = await Cart.create({
          pds,
          pdsInfo,
          totalPrice: totalPriceOfNewAdd
        })
        await User.findByIdAndUpdate(user._id.toString(), {
          cart: cart._id.toString()
        })
        req.user.cart = cart._id.toString()
      } else if (user.cart) {
        //cart 有cartId
        let cart = await Cart.findById(user.cart).lean()
        pds = cart.pds
        pdsInfo = cart.pdsInfo

        if (pds[pd._id]) {
          let pdNum = pds[pd._id]
          let totalPdNum = pdNum + num
          if (totalPdNum > pd.amount) {
            let diffPdNum = pd.amount - pdNum
            totalPriceOfNewAdd = pd.price * diffPdNum
            cart.pds[pd._id] = pd.amount
            req.flash('warningMsg', '此為該數量之上限')
          } else {
            cart.pds[pd._id] = totalPdNum
          }
        } else {
          pds[pd._id] = num
          pdsInfo.push(pd._id)
        }
        cart.totalPrice += totalPriceOfNewAdd
        await Cart.findByIdAndUpdate(user.cart, cart)
      }
    } else {
      //未登入狀態
      if (!cartId) {
        //session內沒有cartId
        let cart = await Cart.create({
          pds,
          pdsInfo,
          totalPrice: totalPriceOfNewAdd
        })
        req.session.cart = cart._id
      } else {
        //session有cartId
        let cart = await Cart.findById(cartId).lean()
        pds = cart.pds
        pdsInfo = cart.pdsInfo
        if (pds[pd._id]) {
          let pdNum = pds[pd._id]
          let totalPdNum = pdNum + num
          if (totalPdNum > pd.amount) {
            let diffPdNum = pd.amount - pdNum
            totalPriceOfNewAdd = pd.price * diffPdNum
            cart.pds[pd._id] = pd.amount
            req.flash('warningMsg', '此為該數量之上限')
          } else {
            cart.pds[pd._id] = totalPdNum
          }
        } else {
          pds[pd._id] = num
          pdsInfo.push(pd._id)
        }
        cart.totalPrice += totalPriceOfNewAdd
        await Cart.findByIdAndUpdate(cartId, cart)
      }
    }
    return res.redirect('back')
  },
  putCart: async (req, res) => {
    const pdId = req.body.id
    const user = req.user
    let cartId = req.session.cart
    if (req.isAuthenticated()) {
      cartId = user.cart
    }
    //session有 cart
    let cart = await Cart.findById(cartId)
      .populate('pdsInfo', '_id price')
      .lean()
    let pdIndex = cart.pdsInfo.findIndex((item) => item._id.toString() === pdId)
    let pd = cart.pdsInfo[pdIndex]
    --cart.pds[pdId]
    cart.totalPrice -= pd.price

    if (cart.pds[pdId] === 0) {
      cart.pdsInfo.splice(pdIndex, 1)
      delete cart.pds[pdId]
    }
    if (cart.totalPrice <= 0) {
      cart.totalPrice = 0
    }
    await Cart.findByIdAndUpdate(cartId, cart)
    return res.redirect('back')
  },
  deleteCart: async (req, res) => {
    const pdId = req.body.id
    const user = req.user
    let cartId = req.session.cart
    if (req.isAuthenticated()) {
      cartId = user.cart
    }
    let cart = await Cart.findById(cartId)
      .populate('pdsInfo', '_id price')
      .lean()
    let num = cart.pds[pdId]
    let pdPrice = 0
    let pdsInfo = []
    cart.pdsInfo.forEach((pd) => {
      if (pd._id.toString() === pdId) {
        pdPrice = pd.price
      } else {
        pdsInfo.push(pd._id.toString())
      }
    })
    cart.pdsInfo = pdsInfo
    cart.totalPrice -= pdPrice * num
    if (cart.totalPrice <= 0) {
      cart.totalPrice = 0
    }
    delete cart.pds[pdId]
    await Cart.findByIdAndUpdate(cartId, cart)
    return res.redirect('back')
  },
  checkCart: async (req, res) => {
    let cartId = req.session.cart
    const user = req.user
    let products = []
    let totalPrice = 0
    if (req.isAuthenticated()) {
      cartId = user.cart
    }
    if (cartId) {
      let cart = await Cart.findById(cartId)
        .populate('pdsInfo', '_id name price pic')
        .lean()
      let pds = cart.pds
      products = cart.pdsInfo
      if (products.length === 0) {
        return res.redirect('back')
      }
      totalPrice = cart.totalPrice
      products.forEach((pd) => {
        pd.num = pds[pd._id]
        pd.totalPrice = pds[pd._id] * pd.price
      })
    } else {
      return res.redirect('back')
    }
    const renderData = { title: '購物車', products, totalPrice }
    res.render('checkCart', renderData)
  }
}
