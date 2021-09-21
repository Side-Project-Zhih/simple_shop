const mongoose = require('mongoose')
const Schema = mongoose.Schema
const order = new Schema({
  customerId: String,
  pds: {
    type: Object,
    required: true
  },
  totalPrice: Number,
  customerInfo: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    default: 'unfinished'
  },
  payment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model('Order', order)
