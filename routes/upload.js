var express = require('express')
var fs = require('fs')
var path = require('path')
var util = require('util')

var multer = require('multer')({
  dest: 'public/uploads'
})

var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('uploadForm.ejs')
})

router.get('/success', function (req, res, next) {
  var {fileName} = req.query
  res.render('uploadOK.ejs', {fileName})
})

router.post('/', [multer.single('attachment')], function (req, res, next) {
  return storeWithOriginalName(req.file)
    .then(encodeURIComponent)
    .then(encoded => {
      res.redirect(`/upload/success?fileName=${encoded}`)
    })
    .catch(next)
})

function storeWithOriginalName (file) {
  var fullNewPath = path.join(file.destination, file.originalname)
  var rename = util.promisify(fs.rename)

  return rename(file.path, fullNewPath)
    .then(() => {
      return file.originalname
    })
}

module.exports = router
