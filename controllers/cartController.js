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
      //wishlist 有wishlistId
      if (user.cart) {
        let cart = await Cart.findById(user.cart).lean()
        let pds = cart.pds
        totalPrice = cart.totalPrice
        for (const key of Object.keys(pds)) {
          products.push(pds[key])
        }
      }
    } else {
      //未登入狀態
      if (cartId) {
        //session有wishlistId
        let cart = await Cart.findById(cartId).lean()
        let pds = cart.pds
        totalPrice = cart.totalPrice
        for (const key of Object.keys(pds)) {
          products.push(pds[key])
        }
      }
    }
    products.forEach((pd) => {
      pd.totalPrice = pd.price * pd.num
    })
    res.render('carts', { products, totalPrice })
  },
  postCart: async (req, res) => {
    let cartId = req.session.cart
    const user = req.user
    const pdId = req.body.id
    let num = +req.body.num
    let pd = await Product.findById(pdId).lean()
    if (num > pd.amount || num <= 0) {
      req.flash('warningMsg', '此為該數量之上限')
      return res.redirect('back')
    }
    let totalPrice = pd.price * num
    let pds = {}
    pd.num = num
    pds[pd._id] = pd
    // 登入狀態
    if (req.isAuthenticated()) {
      //session 未存cartID
      if (!user.cart && !cartId) {
        let cart = await Cart.create({
          pds,
          totalPrice
        })
        await User.findByIdAndUpdate(user._id.toString(), {
          cart: cart._id.toString()
        })
        req.user.cart = cart._id.toString()
      }
      //cart 有cartId
      if (user.cart) {
        let cart = await Cart.findById(user.cart).lean()
        pds = cart.pds
        let cartPd = pds[pd._id]
        if (cartPd) {
          cartPd.num += num
          if (cartPd.num > pd.amount) {
            cartPd.num = pd.amount
          }
        } else {
          pds[pd._id] = pd
        }
        cart.totalPrice += totalPrice
        await Cart.findByIdAndUpdate(user.cart, cart)
      }
    } else {
      //未登入狀態
      if (!cartId) {
        //session內沒有cartId
        let cart = await Cart.create({
          pds,
          totalPrice
        })
        req.session.cart = cart._id
      } else {
        //session有cartId
        let cart = await Cart.findById(cartId).lean()
        pds = cart.pds
        let cartPd = pds[pd._id]
        if (cartPd) {
          cartPd.num += num
          if (cartPd.num > pd.amount) {
            cartPd.num = pd.amount
          }
        } else {
          pds[pd._id] = pd
        }
        cart.totalPrice += totalPrice
        await Cart.findByIdAndUpdate(cartId, cart)
      }
    }
    return res.redirect('back')
  },
  putCart: async (req, res) => {
    const pdId = req.body.id
    let cartId = req.session.cart
    const user = req.user
    if (req.isAuthenticated()) {
      //wishlist 有wishlistId
      if (user.cart) {
        let cart = await Cart.findById(user.cart).lean()
        let cartPd = cart.pds[pdId]
        if (cartPd.num === 1) {
           return res.redirect('back')
        }
        --cartPd.num
        cart.totalPrice -= cartPd.price
        await Cart.findByIdAndUpdate(user.cart, cart)
      }
    } else {
      //未登入狀態
      if (cartId) {
        //session有wishlistId
        let cart = await Cart.findById(cartId).lean()
        let cartPd = cart.pds[pdId]
        if (cartPd.num === 1) {
          return res.redirect('back')
        }
        --cartPd.num
        cart.totalPrice -= cartPd.price
        await Cart.findByIdAndUpdate(user.cart, cart)
      }
    }
    return res.redirect('back')
  }
}
