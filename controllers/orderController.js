const User = require('../models/user')
const Order = require('../models/order')
const helper = require('../helper/helper')
const newbPayHepler = require('../helper/newbPayHepler')
const mailer = require('../config/mailer')
const Cart = require('../models/cart')
const Product = require('../models/product')

let orderLimit = 10
module.exports = {
  renderOrderPage: async (req, res) => {
    const orderId = req.params.id
    let order = await Order.findById(orderId)
      .select('pdsInfo _id receiverInfo createdAt status totalPrice')
      .lean()
    let { pdsInfo, createdAt, _id, receiverInfo, status, totalPrice } = order

    let tradeInfo = {}
    if (status === 'unfinished') {
      tradeInfo = newbPayHepler.genTradeInfo(
        totalPrice,
        orderId,
        req.user.email,
        `/users`
      )
    }
    createdAt = new Date(createdAt).toLocaleString()
    res.render('order', {
      title: '訂單',
      products: pdsInfo,
      totalPrice,
      receiverInfo,
      id: _id,
      createdAt,
      email: req.user.email,
      status: helper.orderStatus(status),
      tradeInfo
    })
  },
  cancelOrder: async (req, res) => {
    const id = req.params.id
    await Order.findByIdAndUpdate(id, { status: 'cancel' })
    res.redirect('back')
  },
  postOrder: async (req, res) => {
    let user = req.user
    let cartId = user.cart
    let receiverInfo = req.body
    for (let key of Object.keys(receiverInfo)) {
      if (!receiverInfo[key]) {
        req.flash('warningMsg', '寄件資訊每一欄都必須填寫')
        return res.render(`/cart/check`, {
          title: '訂單'
        })
      }
    }
    let cart = await Cart.findById(cartId)
      .populate('pdsInfo', '_id name price amount ')
      .lean()
    let totalPrice = cart.totalPrice
    let { pdsInfo, pds } = cart
    for (let pd of pdsInfo) {
      let num = pds[pd._id]
      pd.num = num
      pd.totalPrice = pd.price * num
      delete pd.amount
    }
    let orderInfo = {
      customerId: user._id,
      pdsInfo,
      totalPrice,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      receiverInfo
    }
    let order = await Order.create(orderInfo)
    user.orders[order._id.toString()] = true
    const mailContent = {
      from: process.env.googleAccount,
      to: user.email,
      subject: 'MY SHOP 訂單成立',
      html: `<h2>感謝您的訂購</h2><br>
      <h2>您的訂單編號為  ${order._id}</h2><br>
      <h2>詳細內容請至商店個人資料查詢</h2><br>`
    }

    await Promise.all([
      User.findByIdAndUpdate(user._id, { cart: null, orders: user.orders }),
      Cart.findByIdAndDelete(cartId),
      mailer.sendMail(mailContent)
    ]).catch((er) => {
      console.log(err)
    })

    res.redirect(`/orders/${order._id.toString()}`)
  },
  getOrders: async (req, res) => {
    const userId = req.user._id
    let { page } = req.query
    page = +page ? +page : 1
    const option = {
      customerId: userId
    }
    const { pages, prev, next } = await helper.getPagination(
      Order,
      option,
      orderLimit,
      page
    )
    let skipNum = orderLimit * (page - 1)
    let orders = await Order.find(option)
      .skip(skipNum)
      .limit(orderLimit)
      .sort({ createdAt: 'desc' })
      .select(' _id createdAt status paymentMethod totalPrice')
      .lean()
    orders.forEach((order) => {
      order.createdAt = new Date(order.createdAt).toLocaleString()
      delete order.pdsInfo
      order.status = helper.orderStatus(order.status)
    })

    res.render('profile', {
      title: '我的訂單',
      orders,
      pages,
      prev,
      page,
      next
    })
  },
  payOrder: async (req, res) => {
    const data = JSON.parse(
      newbPayHepler.create_mpg_aes_decrypt(req.body.TradeInfo)
    )
    let orderId = data.Result.MerchantOrderNo
    if (data.Status === 'SUCCESS') {
      let paymentMethod = data.Result.PaymentType
      await Order.findByIdAndUpdate(orderId, {
        status: 'finished',
        updatedAt: Date.now(),
        paymentMethod
      })
      req.flash('successMsg', `訂單編號 ${orderId} 已付款完成`)
      return res.redirect(`/`)
    }
    return req.flash('warningMsg', `訂單編號 ${orderId} 付款失敗`)
  }
}
