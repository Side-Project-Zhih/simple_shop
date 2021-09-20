const User = require('../models/user')
const Wishlist = require('../models/wishlist')
module.exports = {
  dealWithWishlist: async (req, res, next) => {
    const user = req.user
    const wishlistId = req.session.wishlist
    if (req.isAuthenticated()) {
      if (!user.wishlist && wishlistId) {
        user.wishlist = wishlistId
        await User.findByIdAndUpdate(user._id.toString(), {
          wishlist: wishlistId
        })
      }
    }
    next()
  },
  listWishlistPds: async (req, res, next) => {
    if (req.isAuthenticated() && req.user.wishlist) {
      let wishlist = await Wishlist.findById(req.user.wishlist).lean()
      pds = wishlist.pds
      req.wishlistPds = pds
      return next()
    }
    if (req.session.wishlist) {
      let wishlist = await Wishlist.findById(req.session.wishlist).lean()
      pds = wishlist.pds
      req.wishlistPds = pds
      return next()
    }
    next()
  }
}
