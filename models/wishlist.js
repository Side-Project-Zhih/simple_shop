const mongoose = require('mongoose')
const Schema = mongoose.Schema
const wishlist = new Schema({
  owner: {
    type: String,
    required: true
  },
  pds: {
    type: Map,
    of: { type: Map, of: String }
  }
})
module.exports = mongoose.model('Wishlist', wishlist)
