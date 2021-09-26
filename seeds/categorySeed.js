const Category = require('../models/category')
const db = require('../config/mongoose')
const types = ['種類1', '種類2', '種類3']

db.once('open', async () => {
  const data = types.map((item) => ({ name: item}))
  await Category.insertMany(data)
  await db.close()
  console.log('create category successfully')
})
