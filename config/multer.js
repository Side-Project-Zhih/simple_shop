module.exports = {
  dest: 'temp/',
  limit: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      req.flash('warningMsg', '上傳檔案不符合格式')
      return cb(null, false)
    }
    return cb(null, true)
  }
}