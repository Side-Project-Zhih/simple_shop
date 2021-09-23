const Order = require('../models/order')
const helper = require('../helper/helper')
let orderLimit = 10
module.exports = {
  renderOrders: async (req, res) => {
    let { page } = req.query
    page = +page ? +page : 1
    const option = {
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
    res.render('./admin/orders', { orders, pages, prev, page, next })
  },
}
