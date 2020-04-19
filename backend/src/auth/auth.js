const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { model: Account } = require('../account')

passport.use('login', new LocalStrategy({
  usernameField: 'accountName',
  passwordField: 'password'
}, async function (accountName, password, done) {
  try {
    const account = await Account.findOne({ accountName })
    if (!account) {
      return done('Incorrect username or password.', false)
    }
    const validate = await account.validatePassword(password)
    if (!validate) {
      return done('Incorrect username or password.', false)
    }
    return done(null, account)
  } catch (error) {
    return done(error)
  }
}
))

passport.serializeUser(function (user, done) {
  if (user) done(null, user)
})

passport.deserializeUser(function (id, done) {
  done(null, id)
})
