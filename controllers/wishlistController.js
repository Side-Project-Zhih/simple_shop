const Wishlist = require('../models/wishlist')
const User = require('../models/user')
module.exports = {
  renderWishlistPage: async (req, res) => {
    let wishlistId = req.session.wishlist
    const user = req.user
    let products = []
    if (req.isAuthenticated()) {
      //wishlist 有wishlistId
      if (user.wishlist) {
        let wishlist = await Wishlist.findById(user.wishlist).lean()
        let pds = wishlist.pds
        for (const key of Object.keys(pds)) {
          products.push(pds[key])
        }
      }
    } else {
      //未登入狀態
      if (wishlistId) {
        //session有wishlistId
        let wishlist = await Wishlist.findById(wishlistId).lean()
        let pds = wishlist.pds
        for (const key of Object.keys(pds)) {
          products.push(pds[key])
        }
      }
    }
    res.render('wishlist', { products })
  },
  postWishlist: async (req, res) => {
    let wishlistId = req.session.wishlist
    const user = req.user
    const pd = req.body
    let pds = {}
    pds[pd.id] = pd
    // 登入狀態
    if (req.isAuthenticated()) {
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
        pds.set(pd.id, pd)
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
        pds.set(pd.id, pd)
        await wishlist.save()
      }
    }
    return res.redirect('back')
  },
  putWishlist: async (req, res) => {
    const pdId = req.body.id
    let wishlistId = req.session.wishlist
    const user = req.user
    if (req.isAuthenticated()) {
      //wishlist 有wishlistId
      if (user.wishlist) {
        let wishlist = await Wishlist.findById(user.wishlist)
        wishlist.pds.delete(pdId)
        await wishlist.save()
      }
    } else {
      //未登入狀態
      if (wishlistId) {
        //session有wishlistId
        let wishlist = await Wishlist.findById(wishlistId)
        wishlist.pds.delete(pdId)
        await wishlist.save()
      }
    }
    return res.redirect('back')
  }
}
