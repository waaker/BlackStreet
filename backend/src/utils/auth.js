const passport = require('passport')

const mongoose = require('mongoose')

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

const getLoggedAccountMW = async (req, res, next) => {
  const loggedAccount = await mongoose.model('Account').getAccount(req.user._id)
  return res.status(200).json(loggedAccount)
}

const isAdminMW = async (req, res, next) => {
  if (await isAdminLogic(req, res, next)) {
    return next()
  } else {
    return res.status(403).json({ isAdmin: false })
  }
}

const isAdminLogic = async (req, res, next) => {
  const loggedAccount = await mongoose.model('Account').getAccount(req.user._id)
  return loggedAccount.role === 'admin'
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
