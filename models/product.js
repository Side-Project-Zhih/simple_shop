const mongoose = require('mongoose')
const Schema = mongoose.Schema
const product = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  pic: {
    type: String,
    default: '/pic/no-img.jpg'
  },
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref:'Category',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Product', product)
