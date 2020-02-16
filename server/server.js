const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const sftp = require('./utils')

const app = express()

app.get('/', function (req, res) {
  sftp.list(function (err, list) {
    if (err) throw err
    res.send(list)
  })
})

mongoose.connect(`mongodb://${config.get('Database.uri')}:${config.get('Database.port')}/${config.get('Database.name')}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(config.get('General.port'), function () {
    console.log(`App listening on port ${config.get('General.port')}\nDatabase connected on port ${config.get('Database.port')}`)
  })
})
