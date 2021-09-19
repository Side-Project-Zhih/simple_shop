const Category = require('../models/category')
const Product = require('../models/product')
const helper = require('../helper/helper')
const pdNumLimit = 12
module.exports = {
  renderIndexPage: async (req, res) => {
    let { category, order, page } = req.query
    let pdOption = {}
    page = +page ? +page : 1
    if (category) {
      pdOption = {
        category
      }
    }
    const [orderOption, orderName_cht] = helper.orderType(order)
    let totalNum = await Product.countDocuments(pdOption)
    let totalPage = Math.ceil(totalNum / pdNumLimit)
    let pages = Array.from({ length: totalPage }, (_, i) => i + 1)
    let prev = page - 1 <= 0 ? 1 : page - 1
    let next = page + 1 >= totalPage ? totalPage : page + 1

    let products = await Product.find(pdOption)
      .skip(pdNumLimit * (page - 1))
      .limit(pdNumLimit)
      .sort(orderOption)
      .lean()
      .then((products) => {
        products.forEach((item) => {
          item.name = item.name.substring(0, 18)
        })
        return products
      })

    res.render('index', {
      products,
      category,
      orderName_cht,
      order,
      pages,
      prev,
      page,
      next
    })
  },
  searchProduct: async (req, res) => {
    let { keyword, order, page } = req.query
    if (keyword) return res.redirect('back')

    const pdOption = {
      name: { $regex: keyword, $options: 'i' }
    }

    let totalNum = await Product.countDocuments(pdOption)
    let totalPage = Math.ceil(totalNum / pdNumLimit)
    let pages = Array.from({ length: totalPage }, (_, i) => i + 1)
    let prev = page - 1 <= 0 ? 1 : page - 1
    let next = page + 1 >= totalPage ? totalPage : page + 1

    const [orderOption, orderName_cht] = helper.orderType(order)
    const products = await Product.find(pdOption)
      .skip(pdNumLimit * (page - 1))
      .limit(pdNumLimit)
      .sort(orderOption)
      .lean()
      .then((products) => {
        products.forEach((item) => {
          item.name = item.name.substring(0, 18)
        })
        return products
      })
    keyword = encodeURIComponent(keyword)
    res.render('index', {
      products,
      category,
      orderName_cht,
      order,
      pages,
      prev,
      page,
      next,
      keyword
    })
  }
}
