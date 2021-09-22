const db = require('../config/mongoose')
const bcrypt  = require('bcryptjs')
const User = require('../models/user')
let password = '12345678'
const userData = Array.from({length:5}).map((_,i) => {
  password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  return {
    name :  `user${i+1}`,
    password,
    email: `user${i+1}@example.com`
  }
})
userData[0].isValid = true
userData.push({
  name: 'root',
  email: 'root@example.com',
  password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
  isValid: true,
  role:'admin'
})
db.once('open', async()=> {
  await User.insertMany(userData)
  await db.close()
  console.log('create user Data successfully')
})