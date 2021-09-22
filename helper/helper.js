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
    // console.log(a,b)
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  getPagination: async (model, option, limit, page) => {
    let totalNum = await model.countDocuments(option)
    let totalPage = Math.ceil(totalNum / limit)
    let pages = Array.from({ length: totalPage }, (_, i) => i + 1)
    let prev = page - 1 <= 0 ? 1 : page - 1
    let next = page + 1 >= totalPage ? totalPage : page + 1
    return {
      pages,
      prev,
      next
    }
  },
  getProfilePart: (data) => {
    const { editPwd, credit, orders } = data
    const obj = {}
    if (editPwd) {
      obj.isEditPwd = true
    } else if (credit) {
      obj.isCredit = true
    } else if (orders) {
      //撈出處理orders
    } else {
      obj.isProfile = true
    }
    return obj
  },
  orderStatus: (status) => {
    let output = ''
    if (status === 'unfinished') {
      output = '尚未付款'
    }
    if (status === 'cancel') {
      output = '訂單已取消'
    }
    if (status === 'finished') {
      output = '訂單已付款'
    }
    return output
  },
  stringToBase64: (string) => {
    return Buffer.from(string).toString('base64')
  },
  base64ToString: (string) => {
    return Buffer.from(string, 'base64').toString('ascii')
  }
}
