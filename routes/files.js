const express = require('express')
const fs = require('fs')
const path = require('path')
const util = require('util')
const router = express.Router()

function filterDotFiles (files) {
  return files.filter(f => f.match(/^[^.].*$/))
}

router.get('/', async (req, res, next) => {
  const testFolder = path.join(__dirname, '../public/uploads')
  const readdir = util.promisify(fs.readdir)

  try {
    const files = await readdir(testFolder)
    const files_1 = filterDotFiles(files)
    res.render('files.ejs', { files: files_1 })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
