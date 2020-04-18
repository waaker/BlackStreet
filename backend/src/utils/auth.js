const passport = require('passport')

const login = () => {
  return (req, res, next) => {
    passport.authenticate('login', async (err, account, info) => {
      if (err) {
        res.status(400).json(err)
      } else {
        req.login(account, function (err) {
          if (err) return next(err)
          next()
        })
      }
    })(req, res, next)
  }
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ statusCode: 401, message: 'Not authenticated' })
}

const logout = (req, res, next) => {
  req.logout()
  return next()
}

module.exports = {
  login,
  isLoggedIn,
  logout
}
