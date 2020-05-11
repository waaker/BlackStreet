const passport = require('passport')

const loginMW = () => {
  return (req, res, next) => {
    try {
      passport.authenticate('login', async (err, account, info) => {
        if (err) {
          res.status(401).json(err)
        } else {
          req.login(account, function (err) {
            if (err) {
              res.status(401).json(err)
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

const logoutMW = (req, res, next) => {
  req.logout()
  res.status(200).json({ loggedIn: false })
}

const isLoggedInMW = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ isLoggedIn: false })
}

const getLoggedAccountMW = (req, res, next) => {
  res.status(200).json(req.user)
}

const isAdminMW = (req, res, next) => {
  if (isAdminLogic(req, res, next)) {
    next()
  } else {
    res.status(403).json({ isAdmin: false })
  }
}

const isAdminLogic = (req, res, next) => {
  return req.user.accountName === 'admin' // TODO Implement real admin check
}

const isServerOwnerOrAdminMW = (req, res, next) => {
  if (req.user.ftpsServers.includes(req.params.serverId)) {
    next()
  } else {
    if (isAdminLogic(req, res, next)) {
      next()
    } else {
      res.status(403).json({ owner: false })
    }
  }
}

const isAccountOwnerOrAdminMW = (req, res, next) => {
  if (req.user._id === req.params.accountId) {
    next()
  } else {
    if (isAdminLogic(req, res, next)) {
      next()
    } else {
      res.status(403).json({ owner: false })
    }
  }
}

module.exports = {
  loginMW,
  logoutMW,
  isLoggedInMW,
  getLoggedAccountMW,
  isAdminMW,
  isServerOwnerOrAdminMW,
  isAccountOwnerOrAdminMW
}
