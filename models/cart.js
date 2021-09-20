const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cart = new Schema({
  pds: {
    type: Map,
    of: {
      type: Map,
      of: String
    }
  },
  totalPrice: Number
})
module.export = mongoose.model('Cart', cart)
