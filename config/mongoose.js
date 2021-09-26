const mongoose = require('mongoose')
const DB_URL = process.env.mongoDBurl || 'mongodb://localhost/MYSHOP'
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
  console.log('mongodb connect successfully')
})

module.exports = db
