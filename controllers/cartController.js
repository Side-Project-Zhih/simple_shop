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
        let cart = await Cart.findById(user.cart)
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
    } else {
      //未登入狀態
      if (cartId) {
        //session有wishlistId
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
    }
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
    let pdsInfo = [pdId]
    pds[pd._id] = num
    // 登入狀態
    if (req.isAuthenticated()) {
      //session 未存cartID
      if (!user.cart && !cartId) {
        let cart = await Cart.create({
          pds,
          pdsInfo,
          totalPrice
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
        let cartPd = pds[pd._id]
        if (cartPd) {
          let pdNum = cartPd
          if (pdNum + num > pd.amount) {
            let diff = pd.amount - pdNum
            totalPrice = pd.price * diff
            cart.pds[pd._id] = pd.amount
          } else {
            cart.pds[pd._id] += num
          }
        } else {
          pds[pd._id] = num
          pdsInfo.push(pd._id)
        }
        cart.totalPrice += totalPrice
        console.log(cart)
        await Cart.findByIdAndUpdate(user.cart, cart)
      }
    } else {
      //未登入狀態
      if (!cartId) {
        //session內沒有cartId
        let cart = await Cart.create({
          pds,
          pdsInfo,
          totalPrice
        })
        req.session.cart = cart._id
      } else {
        //session有cartId
        let cart = await Cart.findById(cartId).lean()
        pds = cart.pds
        pdsInfo = cart.pdsInfo
        let cartPd = pds[pd._id]
        if (cartPd) {
          let pdNum = cartPd
          if (pdNum + num > pd.amount) {
            let diff = pd.amount - pdNum
            totalPrice = pd.price * diff
            cart.pds[pd._id] = pd.amount
          } else {
            cart.pds[pd._id] += num
          }
        } else {
          pds[pd._id] = num
          pdsInfo.push(pd._id)
        }
        cart.totalPrice += totalPrice
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
    let cartPd = cart.pds[pdId]
    let pd = cart.pdsInfo.find((item) => item._id.toString() === pdId)
    if (cartPd.num === 1) {
      return res.redirect('back')
    }
    --cartPd.num
    cart.totalPrice -= pd.price
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
    res.render('checkCart', { products, totalPrice })
  }
}
