const Order = require('../models/order')
const Product = require('../models/product')
const helper = require('../helper/helper')
const fs = require('fs')
let orderLimit = 10
let pdNumLimit = 12
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
      .select('_id createdAt status paymentMethod totalPrice isSent')
      .lean()
    orders.forEach((order) => {
      order.createdAt = new Date(order.createdAt).toLocaleString()
      order.status = helper.orderStatus(order.status)
    })
    res.render('./admin/orders', { orders, pages, prev, page, next })
  },
  editOrderPage: async (req, res) => {
    const orderId = req.params.id
    let order = await Order.findById(orderId)
      .select(
        'pdsInfo _id customerInfo receiverInfo createdAt status totalPrice isSent'
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
      isSent,
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
      isSent,
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
      isSent: Boolean(+data.isSent),
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
      isSent: Boolean(+data.isSent),
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
  putOrder: async (req, res) => {
    const orderId = req.params.id
    let isSent = req.body.isSent
    if (isSent) {
      isSent = Boolean(+isSent)
      await Order.findByIdAndUpdate(orderId, { isSent })
      return res.redirect('back')
    }
    let modifyOrder = JSON.parse(req.body.data)
    modifyOrder.pdsInfo.forEach((pd) => {
      pd.num = pd.modify_num
      pd.price = pd.modify_price
      pd.totalPrice = pd.modify_totalPrice
      delete pd.modify_num
      delete pd.modify_price
      delete pd.modify_totalPrice
    })
    modifyOrder.totalPrice = modifyOrder.modify_totalPrice
    delete modifyOrder.modify_totalPrice
    try {
      await Order.findByIdAndUpdate(orderId, modifyOrder)
      req.flash('successMsg', `訂單編號 ${orderId} 修改成功`)
      res.redirect('/admin/orders')
    } catch (err) {
      req.flash('warningMsg', `訂單編號 ${orderId} 修改失敗`)
      console.error(err)
      res.redirect('/admin/orders')
    }
  },
  searchOrder: async (req, res) => {
    let { keyword } = req.query
    if (!keyword) return res.redirect('/admin/orders')
    page = +page ? +page : 1
    keyword = keyword.trim()
    const order = await Order.findById(keyword).select('-pdsInfo').lean()
    keyword = encodeURIComponent(keyword)
    order.createdAt = new Date(order.createdAt).toLocaleString()
    order.status = helper.orderStatus(order.status)
    keyword = encodeURIComponent(keyword)
    res.render('./admin/orders', {
      orders: [order],
      keyword,
      search: true,
    })
  },
  renderProducts: async (req, res) => {
    let { category, order, page } = req.query
    let pdOption = {}
    page = +page ? +page : 1
    if (category) {
      pdOption = {
        category,
      }
    }
    const [orderOption, orderName_cht] = helper.orderType(order)
    const { pages, prev, next } = await helper.getPagination(
      Product,
      pdOption,
      pdNumLimit,
      page
    )
    let skipNum = pdNumLimit * (page - 1)
    let products = await Product.find(pdOption)
      .skip(skipNum)
      .limit(pdNumLimit)
      .sort(orderOption)
      .lean()
    res.render('./admin/products', {
      products,
      category,
      orderName_cht,
      order,
      pages,
      prev,
      page,
      next,
    })
  },
  searchProducts: async (req, res) => {
    let { category, keyword, order, page } = req.query
    if (!keyword) return res.redirect('/admin/products')
    page = +page ? +page : 1
    keyword = keyword.trim()
    const pdOption = {
      name: { $regex: keyword, $options: 'i' },
      category,
    }
    const { pages, prev, next } = await helper.getPagination(
      Product,
      pdOption,
      pdNumLimit,
      page
    )
    const [orderOption, orderName_cht] = helper.orderType(order)
    let skipNum = pdNumLimit * (page - 1)
    const products = await Product.find(pdOption)
      .skip(skipNum)
      .limit(pdNumLimit)
      .sort(orderOption)
      .lean()
    keyword = encodeURIComponent(keyword)
    res.render('./admin/products', {
      products,
      category,
      orderName_cht,
      order,
      pages,
      prev,
      page,
      next,
      keyword,
    })
  },
  editProductPage: async (req, res) => {
    const pdId = req.params.id
    let product = await Product.findById(pdId).lean()
    res.render('./admin/editProduct', { product })
  },
  putProduct: async (req, res) => {
    const pdId = req.params.id
    const file = req.file
    let { name, price, amount, description, category } = req.body
    price = +price
    amount = +amount
    if (file) {
      let data = await fs.promises.readFile(file.path)
      await fs.promises.writeFile(`./public/pic/upload/${file.originalname}`, data)
      let pic = `/pic/upload/${file.originalname}`
      try {
        await Product.findByIdAndUpdate(pdId, {
          name,
          price,
          amount,
          description,
          pic,
          category
        })
        req.flash('successMsg', '商品資訊修改成功')
      } catch (err) {
        req.flash('warningMsg', '商品資訊修改失敗')
      }
    } else {
      try {
        await Product.findByIdAndUpdate(pdId, {
          name,
          price,
          amount,
          description,
          category,
        })
        req.flash('successMsg', '商品資訊修改成功')
      } catch (err) {
        req.flash('warningMsg', '商品資訊修改失敗')
      }
    }
    return res.redirect(`/admin/products/${pdId}`)
  },
}
