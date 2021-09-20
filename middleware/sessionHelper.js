const User = require('../models/user')
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
  }
}
