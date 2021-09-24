const AWS = require('aws-sdk')
let s3 = new AWS.S3({
  accessKeyId: process.env.s3accessKeyId,
  secretAccessKey: process.env.s3secretAccessKey
})
module.exports = {
  uploadToS3: (params) => {
    return new Promise((res, rej) => {
      s3.upload(params, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  },
  removeFromS3: (params) => {
    return new Promise((res, rej) => {
      s3.deleteObject(params, function (err, data) {
        if (err) {
          rej(err)
        } else {
          res(data)
        }
      })
    })
  }
}
