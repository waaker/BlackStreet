const passport = require('passport')

const login = () => {
  return (req, res, next) => {
    passport.authenticate('login', async (err, account, info) => {
      if (err) {
        res.status(401).json(err)
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
  return res.status(401).json('Not authenticated')
}

const logout = (req, res, next) => {
  req.logout()
  return next()
}

const isAdmin = (req, res, next) => {
  if (JSON.parse(req.body.accountInfo).accountName === 'admin') {
    return next()
  }
  return res.status(403).json({ isAdmin: false })
}

module.exports = {
  login,
  isLoggedIn,
  logout,
  isAdmin
}
