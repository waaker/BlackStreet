const express = require('express')
const sftp = require('./utils')

const app = express()

app.get('/', function (req, res) {
  sftp.list(function (err, list) {
    if (err) throw err
    res.send(list)
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
