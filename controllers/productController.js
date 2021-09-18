const Category = require('../models/category')
const Product = require('../models/product')
const helper = require('../helper/hepler')
module.exports = {
  renderIndexPage: async (req, res) => {
    const { category, order } = req.query
    let pdOption = {}
    if (category) {
      pdOption = {
        category
      }
    }

    const [orderOption, orderName_cht] = helper.orderType(order)

    let products = await Product.find(pdOption)
      .sort(orderOption)
      .lean()
      .then((products) => products)

    products.forEach((item) => {
      item.name = item.name.substring(0, 18)
    })
    res.render('index', { products, category, orderName_cht })
  },
  searchProduct: async (req, res) => {
    let { keyword, order } = req.query
    const pdOption = {
      name: { $regex: keyword, $options: 'i' }
    }
    const [orderOption, orderName_cht] = helper.orderType(order)
    const products = await Product.find(pdOption).sort(orderOption).lean()
    products.forEach((item) => {
      item.name = item.name.substring(0, 18)
    })
    keyword = encodeURIComponent(keyword)
    res.render('index', {products,orderName_cht, keyword})
  }
}
