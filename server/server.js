const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const routes = require('./routes')

const app = express()

app.use('/', routes)

mongoose.connect(`mongodb://${config.get('Database.uri')}:${config.get('Database.port')}/${config.get('Database.name')}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(config.get('General.port'), function () {
    console.log(`App listening on port ${config.get('General.port')}\nDatabase connected on port ${config.get('Database.port')}`)
  })
})
