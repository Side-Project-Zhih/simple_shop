const User = require('../models/user')
const Cart = require('../models/cart')
const Order = require('../models/order')
module.exports = {
  renderOrderPage: (req, res) => {},
  cancelOrder: async (req, res) => {},
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
    
    await  User.findByIdAndUpdate(user._id, { cart: null , orders: user.orders})
    
    res.redirect(`/orders/${order._id.toString()}/payment`)
  },
  getOrders: async (req, res) => {}
}
