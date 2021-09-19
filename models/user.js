const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
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
    of: new Schema({
      cardNumber: String,
      expMon: String,
      expYear: String
    })
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
})

module.exports = mongoose.model('User', User)
