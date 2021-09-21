const mongoose = require('mongoose')
const Schema = mongoose.Schema

const order = new Schema({
  customerId: String,
  pdsInfo: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
    required: true
  },
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
  receiverInfo: {
    type: Object,
    required: true
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
