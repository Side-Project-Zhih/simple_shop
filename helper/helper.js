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
  pagination: (db, page, limit) => {
    --page

    db.find()
  }
}
