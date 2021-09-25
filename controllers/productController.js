const Category = require('../models/category')
const Product = require('../models/product')
const helper = require('../helper/helper')
const pdNumLimit = 12
module.exports = {
  renderIndexPage: async (req, res) => {
    const wishlistPds = req.wishlistPds
    let { category, order, page } = req.query
    let pdOption = {}
    page = +page ? +page : 1
    if (category) {
      pdOption = {
        category
      }
    }
    const [orderOption, orderName_cht] = helper.orderType(order)
    const { pages, prev, next } = await helper.getPagination(Product,
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
      .then((products) => {
        products.forEach((item) => {
          if (wishlistPds && wishlistPds[item._id]) {
            item.isInWishlist = true
          }
          item.shortName = item.name.substring(0, 18)
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
    const wishlistPds = req.wishlistPds
    let { category,keyword, order, page } = req.query
    if (!keyword) return res.redirect('/')
    page = +page ? +page : 1
    const pdOption = {
      name: { $regex: keyword, $options: 'i' },
    }
    if(category){
      pdOption.category = category
    }
    const { pages, prev, next } =await  helper.getPagination(Product,
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
      .then((products) => {
        products.forEach((item) => {
          if (wishlistPds && wishlistPds[item._id]) {
            item.isInWishlist = true
          }
          item.shortName = item.name.substring(0, 18)
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
  },
  renderProductPage: async (req, res) => {
    const wishlistPds = req.wishlistPds
    const { productId } = req.params
    let isInWishlist = (wishlistPds && wishlistPds[productId])? true: false
    let product = await Product.findById(productId).lean()
    product.amount = Array.from({ length: product.amount }).map((_, i) => i + 1)
    res.render('pd_detail', { product, isInWishlist })
  }
}
