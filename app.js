const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const connectFlash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const putInTemplate = require('./middleware/putInTemplate')
const sessionHelper = require('./middleware/sessionHelper')
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

//methodOveride
app.use(methodOverride('_method'))

//flash
app.use(connectFlash())
//session
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
  })
)
//passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')
//template
app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./helper/helper')
  })
)
app.set('view engine', 'hbs')

//處理放入template常用的資料
app.use(putInTemplate)
//處理session內的wishlist
app.use(sessionHelper.dealWithWishlist)
//處理session內的cart
app.use(sessionHelper.dealCart)
//放入routes
app.use(router)

app.listen(port, () =>
  console.log(`operate server successfully at port :${port}`)
)
