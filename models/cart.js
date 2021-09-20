const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cart = new Schema(
  {
    pds: {
      type: Object,
      default: {}
    },
    totalPrice: Number
  },
  { minimize: false }
)
module.exports = mongoose.model('Cart', cart)
