const User = require('../models/user')
const Cart = require('../models/cart')
const Order = require('../models/order')
const helper = require('../helper/helper')
const { populate } = require('../models/user')
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

    await User.findByIdAndUpdate(user._id, { cart: null, orders: user.orders })

    res.redirect(`/orders/${order._id.toString()}`)
  },
  getOrders: async (req, res) => {
    const userId = req.user._id
    let orders = await Order.find({ customerId: userId })
      .populate('pdsInfo', 'totalPrice -_id')
      .select('pdsInfo _id createdAt status')
      .lean()
    orders.forEach(order => {
      order.createdAt = new Date(order.createdAt).toLocaleString()
      order.totalPrice = order.pdsInfo.totalPrice
      delete order.pdsInfo
      order.status = helper.orderStatus(order.status)
    })
    console.log(orders)
    res.render('profile', { orders })
  }
}
