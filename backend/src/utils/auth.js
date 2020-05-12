const passport = require('passport')

const loginMW = () => {
  return (req, res, next) => {
    try {
      passport.authenticate('login', async (err, account, info) => {
        if (err) {
          return res.status(401).json(err)
        } else {
          req.login(account, function (err) {
            if (err) {
              return res.status(401).json(err)
            } else {
              return res.status(200).json({ loggedIn: true })
            }
          })
        }
      })(req, res, next)
    } catch (err) {
      return res.status(401).json(err)
    }
  }
}

const logoutMW = (req, res, next) => {
  req.logout()
  return res.status(200).json({ loggedIn: false })
}

const isLoggedInMW = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ isLoggedIn: false })
}

const getLoggedAccountMW = (req, res, next) => {
  return res.status(200).json(req.user)
}

const isAdminMW = (req, res, next) => {
  if (isAdminLogic(req, res, next)) {
    return next()
  } else {
    return res.status(403).json({ isAdmin: false })
  }
}

const isAdminLogic = (req, res, next) => {
  return req.user.role === 'admin'
}

const isServerOwnerOrAdminMW = (req, res, next) => {
  if (req.user.ftpsServers.includes(req.params.serverId)) {
    return next()
  } else {
    if (isAdminLogic(req, res, next)) {
      return next()
    } else {
      return res.status(403).json({ owner: false })
    }
  }
}

const isAccountOwnerOrAdminMW = (req, res, next) => {
  if (req.user._id === req.params.accountId) {
    return next()
  } else {
    if (isAdminLogic(req, res, next)) {
      return next()
    } else {
      return res.status(403).json({ owner: false })
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
