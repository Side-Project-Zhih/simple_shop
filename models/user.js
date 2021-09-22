const mongoose = require('mongoose')
const Schema = mongoose.Schema
let card = new Schema({
  cardNumber: String,
  expMon: String,
  expYear: String
})
const User = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'user'
    },
    isValid: {
      type: Boolean,
      required: true,
      default: false
    },
    phone: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    mailNum: {
      type: Number
    },
    address: {
      type: String
    },
    creditCard: {
      type: Map,
      of: String
    },
    wishlist: {
      type: String,
      default: null
    },
    orders: {
      type: Object,
      default: {}
    },
    cart: {
      type: String,
      default: null
    },
    createdAt: {
      type: Date,
      default: new Date()
    },
    updatedAt: {
      type: Date,
      default: new Date()
    },
    isGoogle: Boolean,
    isFb: Boolean
  },
  { minimize: false }
)

module.exports = mongoose.model('User', User)
