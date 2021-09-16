const express = require('express')
const app = express()
const exphbr = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const connectFlash = require('connect-flash')
const session = require('express-session')
const port = process.env.PORT || 3000
const router = require('./routes/index')
//bodyparesr
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('public'))

//session
app.use(session({ secret: 'test', resave: false, saveUninitialized: true }))

//template
app.engine('hbs', exphbr({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

//methodOveride
app.use(methodOverride('_method'))

//flash
app.use(connectFlash())

//test route
app.use(router)
app.listen(port, () =>
  console.log(`operate server successfully at port :${port}`)
)
