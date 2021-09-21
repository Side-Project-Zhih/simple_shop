const mongoose = require('mongoose')
const Schema = mongoose.Schema
const order = new Schema({
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
    type:String,
    default: "unfinished"
  },
  payment:{
    type:String
  }

})

module.exports = mongoose.model('Order', order)
