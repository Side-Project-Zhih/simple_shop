const db = require('../config/mongoose')
const bcrypt  = require('bcryptjs')
const User = require('../models/user')
const userData = Array.from({length:5}).map((_,i) => {
  let password = '12345678'
  password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  return {
    name :  `user${i+1}`,
    password,
    email: `user${i+1}@example.com`
  }
})
db.once('open', async()=> {
  await User.insertMany(userData)
  await db.close()
  console.log('create user Data successfully')
})