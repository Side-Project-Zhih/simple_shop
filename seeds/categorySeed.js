const Category = require('../models/category')
const db = require('../config/mongoose')
const types = [
  '思ったよりも寂しくない',
  '流れ弾',
  'なぜ恋をして来なかったんだろう？'
]

db.once('open', async () => {
  const data = types.map((item) => ({ name: item, amount: 15 }))
  await Category.insertMany(data)
  await db.close()
  console.log('create category successfully')
})
