const Category = require('../models/category')
module.exports = async (req, res, next) => {
  res.locals.successMsg = req.flash('successMsg')
  res.locals.warningMsg = req.flash('warningMsg')
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  let categories = await Category.find().select('_id name').lean()
  categories.forEach((category) => {
    category._id = category._id.toString()
    category.url = encodeURIComponent(category.name)
  })
  res.locals.categories = categories
  next()
}
