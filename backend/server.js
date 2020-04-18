const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const config = require('config')
const bodyParser = require('body-parser')
const passport = require('passport')

const routes = require('./src/routes')

const app = express()

mongoose.connect(`mongodb://${config.get('Database.uri')}:${config.get('Database.port')}/${config.get('Database.name')}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  app.use(session({
    secret: config.get('General.session_secret'),
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(bodyParser.json())
  app.use('/', routes)

  app.listen(config.get('General.port'), function () {
    console.log(`App listening on port ${config.get('General.port')}\nDatabase ${config.get('Database.name')} connected on port ${config.get('Database.port')}`)
  })
})
