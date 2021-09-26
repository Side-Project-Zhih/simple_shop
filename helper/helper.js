const Product = require('../models/product')
const s3 = require('../config/s3')
module.exports = {
  orderType: (order) => {
    let orderOption = {}
    let orderName_cht
    if (order === 'early-late') {
      orderOption = {
        createdAt: 'asc'
      }
      orderName_cht = '上架時間早到晚'
    } else if (order === 'late-early') {
      orderOption = {
        createdAt: 'desc'
      }
      orderName_cht = '上架時間晚到早'
    } else if (order === 'low-high') {
      orderOption = {
        price: 'asc'
      }
      orderName_cht = '價錢低到高'
    } else if (order === 'high-low') {
      orderOption = {
        price: 'desc'
      }
      orderName_cht = '價錢高到低'
    } else {
      orderOption = {
        createdAt: 'desc'
      }
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
  },
  uploadToS3: (params) => {
    return new Promise((res, rej) => {
      s3.upload(params, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  },
  removeFromS3: (params) => {
    return new Promise((res, rej) => {
      s3.deleteObject(params, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }
}
