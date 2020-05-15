const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const config = require('config')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const path = require('path')

const routes = require('./src/routes')

const app = express()

mongoose.connect(`mongodb://${config.get('Database.uri')}:${config.get('Database.port')}/${config.get('Database.name')}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  app.use(session({
    secret: config.get('General.session_secret'),
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.disable('etag')
  app.use(cors())
  app.use(bodyParser.json())
  app.use('/', routes)

  app.use(express.static('dist/frontend'))
  app.get('*', function (req, res) {
    res.sendFile('index.html', {
      root: path.resolve(__dirname, 'dist/frontend')
    })
  })

  app.listen(config.get('General.port'), function () {
    console.log(`App listening on port ${config.get('General.port')}\nDatabase ${config.get('Database.name')} connected on port ${config.get('Database.port')}`)
  })
})
