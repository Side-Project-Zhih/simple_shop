const Product = require('../models/product')
module.exports = {
  orderType: (order) => {
    let orderOption = {}
    let orderName_cht
    if (order === 'A-Z') {
      orderOption = {
        name: 'asc'
      }
      orderName_cht = 'A-Z'
    }
    if (order === 'Z-A') {
      orderOption = {
        name: 'desc'
      }
      orderName_cht = 'Z-A'
    }
    if (order === 'low-high') {
      orderOption = {
        price: 'asc'
      }
      orderName_cht = '價錢低到高'
    }
    if (order === 'high-low') {
      orderOption = {
        price: 'desc'
      }
      orderName_cht = '價錢高到低'
    }
    return [orderOption, orderName_cht]
  },
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  getPagination: async (option, limit, page) => {
     let totalNum = await Product.countDocuments(option)
     let totalPage = Math.ceil(totalNum / limit)
     let pages = Array.from({ length: totalPage }, (_, i) => i + 1)
     let prev = page - 1 <= 0 ? 1 : page - 1
     let next = page + 1 >= totalPage ? totalPage : page + 1
     return {
       pages,
       prev,
       next
     }
  }
}
