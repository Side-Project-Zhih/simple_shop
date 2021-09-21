const User = require('../models/user')
const Order = require('../models/order')
const helper = require('../helper/helper')
const mailer = require('../config/mailer')
let orderLimit = 10
module.exports = {
  renderOrderPage: async (req, res) => {
    const orderId = req.params.id
    let order = await Order.findById(orderId)
      .populate('pdsInfo')
      .select('pdsInfo _id receiverInfo createdAt status')
    let products = []
    let { pds, totalPrice } = order.pdsInfo
    let { createdAt, _id, receiverInfo, status } = order
    for (const key of Object.keys(pds)) {
      pds[key]['totalPrice'] = pds[key]['num'] * pds[key]['price']
      products.push(pds[key])
    }
    createdAt = new Date(createdAt).toLocaleString()
    res.render('order', {
      products,
      totalPrice,
      receiverInfo,
      id: _id,
      createdAt,
      email: req.user.email,
      status: helper.orderStatus(status)
    })
  },
  cancelOrder: async (req, res) => {
    const id = req.params.id
    await Order.findByIdAndUpdate(id, { status: 'cancel' })
    res.redirect('back')
  },
  postOrder: async (req, res) => {
    let user = req.user
    cartId = user.cart
    let receiverInfo = req.body

    let orderInfo = {
      customerId: user._id,
      pdsInfo: cartId,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      receiverInfo
    }

    let order = await Order.create(orderInfo)
    console.log(user.orders)
    user.orders[order._id.toString()] = true
    const mailContent = {
      from: process.env.googleAccount,
      to: 'fufong79570@gmail.com',
      subject: 'MY SHOP 訂單成立',
      html: `<h2>感謝您的訂購</h2><br>
      <h2>您的訂單編號為  ${order._id}</h2><br>
      <h2>詳細內容請至商店個人資料查詢</h2><br>`
    }
    await Promise.all([mailer.sendMail(mailContent)
    ,
    User.findByIdAndUpdate(user._id, { cart: null, orders: user.orders })
    ])

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
      .populate('pdsInfo', 'totalPrice -_id')
      .sort({ createdAt: 'desc' })
      .select('pdsInfo _id createdAt status')
      .lean()
    orders.forEach((order) => {
      order.createdAt = new Date(order.createdAt).toLocaleString()
      order.totalPrice = order.pdsInfo.totalPrice
      delete order.pdsInfo
      order.status = helper.orderStatus(order.status)
    })
    res.render('profile', { orders, pages, prev, page, next })
  }
}
