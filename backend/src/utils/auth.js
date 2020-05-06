const passport = require('passport')

const login = () => {
  return (req, res, next) => {
    try {
      passport.authenticate('login', async (err, account, info) => {
        if (err) {
          throw err
        } else {
          req.login(account, function (err) {
            if (err) {
              throw err
            } else {
              res.status(200).json({ loggedIn: true })
            }
          })
        }
      })(req, res, next)
    } catch (err) {
      res.status(401).json(err)
    }
  }
}

const logout = (req, res, next) => {
  req.logout()
  res.status(200).json({ loggedIn: false })
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ isLoggedIn: false })
}

const getLoggedAccount = (req, res, next) => {
  res.status(200).json(req.user)
}

const isAdmin = (req, res, next) => {
  if (true) { // TODO Implement real admin check
    next()
  } else {
    res.status(403).json({ isAdmin: false })
  }
}

module.exports = {
  login,
  logout,
  isLoggedIn,
  getLoggedAccount,
  isAdmin
}
