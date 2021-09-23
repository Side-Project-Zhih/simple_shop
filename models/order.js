const mongoose = require('mongoose')
const Schema = mongoose.Schema

const order = new Schema({
  customerId: String,
  pdsInfo: {
    type: Array,
    required: true,
  },
  totalPrice: Number,
  customerInfo: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: 'unfinished',
  },
  payment: {
    type: String,
  },
  receiverInfo: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  isSend: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('Order', order)
