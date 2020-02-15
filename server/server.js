const express = require('express')
const config = require('config')

const sftp = require('./utils')

const app = express()

app.get('/', function (req, res) {
  sftp.list(function (err, list) {
    if (err) throw err
    res.send(list)
  })
})

app.listen(config.get('General.port'), function () {
  console.log('Example app listening !')
})
