const mongoose = require('mongoose')
const Schema = mongoose.Schema
const category = new Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number
  }
})

module.exports = mongoose.model('Category', category)
