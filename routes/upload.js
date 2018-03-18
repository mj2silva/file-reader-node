var express = require('express')
var fs = require('fs')
var path = require('path')

var multer = require('multer')({
  dest: 'public/uploads'
})

var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('uploadForm.ejs')
})

router.post('/', [multer.single('attachment')], function (req, res, next) {
  var {fileName} = storeWithOriginalName(req.file)
  res.render('uploadOK.ejs', {fileName})
})

function storeWithOriginalName (file) {
  var fullNewPath = path.join(file.destination, file.originalname)
  fs.renameSync(file.path, fullNewPath)

  return {
    fileName: file.originalname
  }
}

module.exports = router
