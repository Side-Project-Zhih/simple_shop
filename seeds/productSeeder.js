const db = require('../config/mongoose')
const Product = require('../models/product')
const faker = require('faker')
const types = [
  '思ったよりも寂しくない',
  '流れ弾',
  'なぜ恋をして来なかったんだろう？'
]

db.once('open', async () => {
  const data = []
  types.map((type) => {
    let arr = Array.from({ length: 15 }, (_, i) => {
      data.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        pic: `/pic/${type}/${i + 1}.jpg`,
        description: faker.commerce.productDescription(),
        amount: Math.ceil(Math.random() * 10),
        category: type
      })
    })
  })
  await Product.insertMany(data).catch(err => console.log(err))
  await db.close()
  console.log('create products successfully')
})
