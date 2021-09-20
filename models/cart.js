const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cart = new Schema({
  pds: {
    type: Object,
  },
  totalPrice: Number
})
module.exports = mongoose.model('Cart', cart)
