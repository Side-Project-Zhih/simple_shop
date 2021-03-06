const crypto = require('crypto')
require('dotenv').config()
const URL = process.env.BaseUrl
const MerchantID = 'MS323026958'
const HashKey = '5zA360sARmhJ0UsIa6rxih5jtNz9Ur57'
const HashIV = 'ClfvgHRSHOhTpfiP'
const PayGateWay = 'https://ccore.spgateway.com/MPG/mpg_gateway'
const ReturnURL = URL + '/orders/payment/callback?from=ReturnURL'
const NotifyURL = URL + '/orders/payment/callback?from=NotifyURL'
const CutomerURL = URL + '/orders/payment/callback?from=CutomerURL'
const ClientBackURL = URL + '/'
module.exports = {
  genDataChain: function (TradeInfo) {
    let results = []
    for (let kv of Object.entries(TradeInfo)) {
      results.push(`${kv[0]}=${kv[1]}`)
    }
    return results.join('&')
  },
  create_mpg_aes_encrypt: function (TradeInfo) {
    let encrypt = crypto.createCipheriv('aes256', HashKey, HashIV)
    let enc = encrypt.update(this.genDataChain(TradeInfo), 'utf8', 'hex')
    return enc + encrypt.final('hex')
  },
  create_mpg_aes_decrypt: function (TradeInfo) {
    let decrypt = crypto.createDecipheriv('aes256', HashKey, HashIV)
    decrypt.setAutoPadding(false)
    let text = decrypt.update(TradeInfo, 'hex', 'utf8')
    let plainText = text + decrypt.final('utf8')
    let result = plainText.replace(/[\x00-\x20]+/g, '')
    return result
  },
  create_mpg_sha_encrypt: function (TradeInfo) {
    let sha = crypto.createHash('sha256')
    let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

    return sha.update(plainText).digest('hex').toUpperCase()
  },
  genTradeInfo: function (totalPrice, orderId, email) { 
    let data = {
      MerchantID,
      Version: 1.6,
      RespondType: 'JSON',
      TimeStamp: Date.now(),
      MerchantOrderNo: orderId,
      Amt: totalPrice,
      ItemDesc: orderId,
      Email: email,
      LoginType: 0,
      ClientBackURL,
      CREDIT: 1,
      WEBATM: 1,
      NotifyURL,
      ReturnURL,
      CutomerURL
    }
    let aes = this.create_mpg_aes_encrypt(data)
    let hash = this.create_mpg_sha_encrypt(aes)
    let tradeInfo = {
      MerchantID: MerchantID, // ????????????
      TradeInfo: aes, // ???????????????
      TradeSha: hash,
      Version: 1.6, // ??????????????????
      PayGateWay: PayGateWay
    }
    return tradeInfo
  }
}
