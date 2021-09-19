const cardValidator = require('card-validator')

let string = '356969615554938338'
let result = cardValidator.number(string)
console.log(result.isValid)
