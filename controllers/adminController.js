const Order = require('../models/order')
const Product = require('../models/product')
const Category = require('../models/category')
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
    const renderData = {
      title: '管理訂單',
      orders,
      pages,
      prev,
      page,
      next
    }
    res.render('./admin/orders', renderData)
  },
  editOrderPage: async (req, res) => {
    const orderId = req.params.id
    let order = await Order.findById(orderId)
      .select(
        'pdsInfo _id customerInfo receiverInfo createdAt status totalPrice isSent'
      )
      .lean()
    order.id = order._id
    order.products = order.pdsInfo
    order.createdAt = new Date(order.createdAt).toLocaleString()
    delete order._id
    delete order.pdsInfo
    const renderData = {
      title: '修改訂單',
      ...order
    }
    res.render('./admin/editOrder', renderData)
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
        address: data.address
      }
    }
    modifyOrder = JSON.stringify(modifyOrder)
    const renderData = {
      title: '修改訂單',
      products: pdsInfo,
      totalPrice,
      modify_totalPrice,
      id: _id,
      customerInfo,
      createdAt,
      isSent: Boolean(+data.isSent),
      status: helper.orderStatus(data.status),
      receiverInfo: {
        name: data.name,
        phone: data.phone,
        mailNum: +data.mailNum,
        address: data.address
      },
      modifyOrder
    }
    res.render('./admin/editOrderCheck', renderData)
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
    const renderData = {
      title: '搜尋訂單',
      orders: [order],
      keyword,
      search: true
    }
    res.render('./admin/orders', renderData)
  },
  renderProducts: async (req, res) => {
    let { category, order, page } = req.query
    let pdOption = {}
    page = +page ? +page : 1
    if (category) {
      pdOption = {
        category
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
    const renderData = {
      title: '管理商品',
      products,
      category,
      orderName_cht,
      order,
      pages,
      prev,
      page,
      next
    }
    res.render('./admin/products', renderData)
  },
  searchProducts: async (req, res) => {
    let { category, keyword, order, page } = req.query
    if (!keyword) return res.redirect('/admin/products')
    page = +page ? +page : 1
    keyword = keyword.trim()
    const pdOption = {
      name: { $regex: keyword, $options: 'i' }
    }
    if (category) {
      pdOption.category = category
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
    const renderData = {
      title: '搜尋商品',
      products,
      category,
      orderName_cht,
      order,
      pages,
      prev,
      page,
      next,
      keyword
    }
    res.render('./admin/products', renderData)
  },
  editProductPage: async (req, res) => {
    const pdId = req.params.id
    let product = await Product.findById(pdId)
      .populate('category', '_id')
      .lean()
    product.category._id = product.category._id.toString()
    const renderData = {
      title: '修改商品',
      product
    }
    res.render('./admin/editProduct', renderData)
  },
  putProduct: async (req, res) => {
    const pdId = req.params.id
    const file = req.file
    let { name, price, amount, description, category } = req.body
    price = +price
    amount = +amount
    if (file) {
      let data = await fs.promises.readFile(file.path)
      const params = {
        Bucket: `zhih-bucket/${name}`,
        Key: 'pic',
        Body: data,
        ACL: 'public-read',
        ContentType: req.file.mimetype
      }
      let info = await helper.uploadToS3(params)
      let pic = info.Location
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
          category
        })
        req.flash('successMsg', '商品資訊修改成功')
      } catch (err) {
        req.flash('warningMsg', '商品資訊修改失敗')
      }
    }
    return res.redirect(`/admin/products/${pdId}`)
  },
  renderCreatePage: (req, res) => {
    const renderData = {
      title: '建立商品'
    }
    res.render('./admin/createProduct.hbs', renderData)
  },
  createProduct: async (req, res) => {
    let { name, category, price, description, amount } = req.body
    if (!name || !category || !price || !description || !amount) {
      req.flash('warningMsg', '請填寫必填欄位')
      return res.redirect('back')
    }
    let file = req.file
    let product
    try {
      if (file) {
        let data = await fs.promises.readFile(file.path)
        const params = {
          Bucket: `zhih-bucket/${name}`,
          Key: 'pic',
          Body: data,
          ACL: 'public-read',
          ContentType: req.file.mimetype
        }
        let info = await helper.uploadToS3(params)
        let pic = info.Location
        product = await Product.create({
          name,
          category,
          pic,
          price: +price,
          description,
          amount: +amount
        })
      } else {
        product = await Product.create({
          name,
          category,
          price: +price,
          description,
          amount: +amount
        })
      }
      req.flash('successMsg', '商品建立成功')
      return res.redirect(`/admin/products/${product._id}`)
    } catch (err) {
      console.error(err)
      req.flash('warningMsg', '商品建立失敗')
      return res.redirect('back')
    }
  },
  deleteProduct: async (req, res) => {
    const pdId = req.params.id
    try {
      let product = await Product.findById(pdId)
      let { name, pic } = product
      if (pic.includes('http')) {
        const params = {
          Bucket: 'zhih-bucket',
          Key: `${name}/pic`
        }
        await helper.removeFromS3(params)
      } else {
        await fs.promises.unlink(`./public${pic}`)
      }
      await product.remove()
      req.flash('successMsg', `刪除 ${product.name} 成功`)
    } catch (err) {
      console.log(err)
      req.flash('warningMsg', '刪除失敗')
    }
    return res.redirect('back')
  },
  renderCategories: async (req, res) => {
    let categoryId = req.query.id
    let category = await Category.findById(categoryId).lean()
    const renderData = { category, title: '管理種類' }
    res.render('./admin/category', renderData)
  },
  createCategory: async (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('warningMsg', '不能為空白')
      return res.redirect('back')
    }
    try {
      await Category.create({ name })
      req.flash('successMsg', `種類: ${name} 建立成功`)
    } catch (err) {
      console.log(err)
      req.flash('warningMsg', '種類建立失敗')
    }
    res.redirect('back')
  },
  putCategory: async (req, res) => {
    const { name } = req.body
    const categoryId = req.params.id
    if (!name) {
      req.flash('warningMsg', '不能為空白')
      return res.redirect('back')
    }
    try {
      let category = await Category.findById(categoryId)
      let oldName = category.name
      category.name = name
      await category.save()
      req.flash('successMsg', `種類:將 ${oldName} 修改為 ${name}`)
    } catch (err) {
      req.flash('warningMsg', '種類建立失敗')
    }
    res.redirect('/admin/categories')
  },
  deleteCategory: async (req, res) => {
    const categoryId = req.params.id
    try {
      let category = await Category.findByIdAndDelete(categoryId)
      req.flash('warningMsg', `種類: ${category.name} 刪除成功`)
    } catch (err) {
      req.flash('warningMsg', '刪除失敗')
    }
    res.redirect('/admin/categories')
  },
  uploadImgFromDescription: async (req, res) => {
    let file = req.file
    let data = await fs.promises.readFile(file.path)
    const params = {
      Bucket: 'zhih-bucket/description',
      Key: file.originalname, 
      Body: data, 
      ACL: 'public-read',
      ContentType: file.mimetype 
    }
    let info = await helper.uploadToS3(params)
    let url = info.Location
    res.json({ uploaded: true, url })
  }
}
