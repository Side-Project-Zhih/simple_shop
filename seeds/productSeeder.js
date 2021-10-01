const db = require('../config/mongoose')
const Product = require('../models/product')
const faker = require('faker')
const Category = require('../models/category')


db.once('open', async () => {
  const data = []
  let types = await Category.find().select('_id').lean()
  types = types.map((item) => item._id)
  types.map((type) => {
    Array.from({ length: 15 }, (_, i) => {
      data.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        pic: `https://loremflickr.com/320/240/cat?random=${i+1}`,
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
