const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')

const multer = require('multer')({
  dest: 'public/uploads'
})

const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('uploadForm.ejs')
})

router.get('/success', async function (req, res, next) {
  const { fileName } = req.query;
  const { file } = req.file;
  const filePath = path.join(__dirname, '../public/uploads', fileName)
  const file2 = fs.readFileSync(filePath);
  console.log(file);
  res.render('uploadOK.ejs', { fileName, fileData: file2 })
})

router.post('/', [multer.single('attachment')], async function (req, res, next) {
  try {
    const uriComponent = await storeWithOriginalName(req.file)
    const encoded = encodeURIComponent(uriComponent)
    res.render('uploadOK.ejs', { fileName: encoded, fileData: req.file })
  } catch (error) {
    return next(error)
  }
})

async function storeWithOriginalName (file) {
  const fullNewPath = path.join(file.destination, file.originalname)
  const rename = util.promisify(fs.rename)

  await rename(file.path, fullNewPath)
  return file.originalname
}

module.exports = router
