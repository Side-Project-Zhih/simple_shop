module.exports = {
  renderLoginPage: (req, res) => {
    res.render('login', { admin: true })
  }
}
