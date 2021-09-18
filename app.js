const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const connectFlash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')

const port = process.env.PORT || 3000
const router = require('./routes/index')
//bodyparesr
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

//session
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')
//template
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

//methodOveride
app.use(methodOverride('_method'))

//flash
app.use(connectFlash())


app.use((req, res, next) => {

  res.locals.successMsg = req.flash('successMsg')
  res.locals.warningMsg = req.flash('warningMsg')
next()
})


app.use(router)
app.listen(port, () =>
  console.log(`operate server successfully at port :${port}`)
)
