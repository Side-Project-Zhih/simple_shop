const nodeMailer = require('nodemailer')
let transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    type: 'OAuth2',
    user: process.env.googleAccount,
    clientId: process.env.googleClientId_mail,
    clientSecret: process.env.googleClientSecret_mail,
    refreshToken: process.env.refreshToken,
    accessToken: process.env.accessToken
  }
})
module.exports = transporter