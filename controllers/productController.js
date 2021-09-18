const Category = require('../models/category')
const Product = require('../models/product')
const helper = require('../helper/hepler')
module.exports = {
  renderIndexPage: async (req, res) => {
    const {category, order}  = req.query
    let pdOption = {}
    let orderOption = {}
    let orderName_cht 
      if (category){
        pdOption = {
          category
        }
      }
      if(order){
        [orderOption, orderName_cht] = helper.orderType(order)
      }
    
    let [categories, products] = await Promise.all([
      Category.find()
        .lean()
        .then((categories) => categories),
      Product.find(pdOption)
        .sort(orderOption)
        .lean()
        .then((products) => products)
    ])
    categories.forEach((item) => {
      item.url = encodeURIComponent(item.name)
    })
    products.forEach(item => {
      item.name = item.name.substring(0,18)
    })
    res.render('index', { categories, products, category, orderName_cht})
  },
  searchProduct: (req, res) =>{

  }
}
