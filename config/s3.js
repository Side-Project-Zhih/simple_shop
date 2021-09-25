const AWS = require('aws-sdk')
let s3 = new AWS.S3({
  accessKeyId: process.env.s3accessKeyId,
  secretAccessKey: process.env.s3secretAccessKey
})
module.exports = s3
