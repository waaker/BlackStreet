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
              const payload = {
                loggedIn: true,
                id: req.user._id
              }
              res.status(200).json(payload)
            }
          })
        }
      })(req, res, next)
    } catch (err) {
      res.status(401).json(err)
    }
  }
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ isLoggedIn: false })
}

const logout = (req, res, next) => {
  req.logout()
  res.status(200).json({ loggedIn: false })
}

const isAdmin = (req, res, next) => {
  if (true) { // TODO Implement real admin check
    res.status(200).json({ isAdmin: true })
  }
  res.status(403).json({ isAdmin: false })
}

module.exports = {
  login,
  isLoggedIn,
  logout,
  isAdmin
}
