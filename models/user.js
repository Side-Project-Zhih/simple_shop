const mongoose = require('mongoose')
const { NUMBER } = require('sequelize/types')
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
    type: NUMBER
  },
  address: {
    type: [String]
  },
  creditCard:{
    type: Map,
    of:new Schema({
      cardNumber: String,
      cardType:String,
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
  }
})

module.exports = mongoose.model('User', User)
