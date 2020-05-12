const express = require('express')
require('../auth')
const utils = require('../utils')

const router = express.Router()

router
  .route('/login')
  .post(
    utils.auth.loginMW(),
    async function (req, res, next) {}
  )

router
  .route('/logout')
  .post(
    utils.auth.isLoggedInMW,
    utils.auth.logoutMW,
    async function (req, res, next) {}
  )

router
  .route('/isLoggedIn')
  .get(
    utils.auth.isLoggedInMW,
    async function (req, res, next) {
      res.status(200).json({ isLoggedIn: true })
    }
  )

router
  .route('/loggedAccount')
  .get(
    utils.auth.isLoggedInMW,
    utils.auth.getLoggedAccountMW,
    async function (req, res, next) {}
  )

router
  .route('/isAdmin')
  .get(
    utils.auth.isLoggedInMW,
    utils.auth.isAdminMW,
    async function (req, res, next) {
      res.status(200).json({ isAdmin: true })
    }
  )

module.exports = router
