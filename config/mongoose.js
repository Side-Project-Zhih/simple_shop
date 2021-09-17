const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost/todo-list'
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const db = mongoose.connection
db.on('error', (error)=> {
  console.log(`error happen because ${error}`)
})
db.once('open', ()=> {
  console.log('mongodb connect successfully')

})