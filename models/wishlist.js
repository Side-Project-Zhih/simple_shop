const mongoose = require('mongoose')
const Schema = mongoose.Schema
const wishlist = new Schema({
  owner:{
    type: String,
    required:true
  },
  pds: Array
})
module.exports = mongoose.model('Wishlist', wishlist)