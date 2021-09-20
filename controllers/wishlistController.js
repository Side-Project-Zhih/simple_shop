const Wishlist = require('../models/wishlist')
const User = require('../models/user')
module.exports = {
  renderWishlistPage: (req, res) => {
    res.render('wishList')
  },
  postWishlist: async (req, res) => {
    let wishlistId = req.session.wishlist
    const user = req.user
    const pd = req.body
    let pds = {}
    pds[pd.id] = {
      name: pd.name,
      price: pd.price
    }
    // 登入狀態
    if (req.isAuthenticated()) {
      console.log('login')
      //session 未存wishlistID
      if (!user.wishlist && !wishlistId) {
        let wishlist = await Wishlist.create({
          owner: req.session.id,
          pds
        })
        let owner = await User.findByIdAndUpdate(user._id.toString(), {
          wishlist: wishlist._id.toString()
        })
      }
      //wishlist 有wishlistId
      if (user.wishlist) {
        let wishlist = await Wishlist.findById(user.wishlist)
        pds = wishlist.pds
        pds.set(pd.id, {
          name: pd.name,
          price: pd.price
        })
        await wishlist.save()
      }
    } else {
      //未登入狀態
      if (!wishlistId) {
        //session內沒有wishlistId
        let wishlist = await Wishlist.create({
          owner: req.session.id,
          pds
        })
        req.session.wishlist = wishlist._id
      } else {
        //session有wishlistId
        let wishlist = await Wishlist.findById(wishlistId)
        pds = wishlist.pds
        pds.set(pd.id, {
          name: pd.name,
          price: pd.price
        })
        await wishlist.save()
      }
    }
    return res.redirect('back')
  }
}
