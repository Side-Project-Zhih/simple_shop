const mongoose = require('mongoose')
require('dotenv').config()
const DB_URL = 'mongodb://localhost/MYSHOP'
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
const db = mongoose.connection
db.on('error', (error) => {
  console.log(`error happen because ${error}`)
})
db.once('open', () => {
  console.log(DB_URL)
  console.log('mongodb connect successfully')
})

module.exports = db
