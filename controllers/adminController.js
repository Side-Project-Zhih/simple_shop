const Order = require('../models/order')
const helper = require('../helper/helper')
let orderLimit = 10
module.exports = {
  renderOrders: async (req, res) => {
    let { page } = req.query
    page = +page ? +page : 1
    const option = {}
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
  editOrderPage: async (req, res) => {
    const orderId = req.params.id
    let order = await Order.findById(orderId)
      .select(
        'pdsInfo _id customerInfo receiverInfo createdAt status totalPrice'
      )
      .lean()
    let {
      pdsInfo,
      createdAt,
      _id,
      customerInfo,
      receiverInfo,
      status,
      totalPrice,
    } = order
    createdAt = new Date(createdAt).toLocaleString()
    res.render('./admin/editOrder', {
      products: pdsInfo,
      totalPrice,
      receiverInfo,
      id: _id,
      user: customerInfo,
      createdAt,
      status,
    })
  },
  checkOrderChange: async (req, res) => {
    let data = req.body
    let orderId = req.params.id
    let order = await Order.findById(orderId)
      .select(
        'pdsInfo _id customerInfo receiverInfo createdAt status totalPrice'
      )
      .lean()
    let { pdsInfo, totalPrice, customerInfo, createdAt, _id } = order
    let modify_totalPrice = 0
    pdsInfo.forEach((pd) => {
      let id = pd._id
      pd.modify_price = +data[`${id}_price`]
      pd.modify_num = +data[`${id}_num`]
      pd.modify_totalPrice = +data[`${id}_price`] * +data[`${id}_num`]
      modify_totalPrice += pd.modify_price * pd.modify_num
    })
    let modifyOrder = {
      pdsInfo,
      totalPrice,
      modify_totalPrice,
      status: data.status,
      receiverInfo: {
        name: data.name,
        phone: data.phone,
        mailNum: +data.mailNum,
        address: data.address,
      },
    }
    modifyOrder = JSON.stringify(modifyOrder)

    res.render('./admin/editOrderCheck', {
      products: pdsInfo,
      totalPrice,
      modify_totalPrice,
      id: _id,
      user: customerInfo,
      createdAt,
      status: helper.orderStatus(data.status),
      receiverInfo: {
        name: data.name,
        phone: data.phone,
        mailNum: +data.mailNum,
        address: data.address,
      },
      modifyOrder,
    })
  },
  putOrder:(req, res) => {
    console.log(req.body)
    let modifyOrder = JSON.parse(req.body.data)
    console.log(modifyOrder)
  }
}
