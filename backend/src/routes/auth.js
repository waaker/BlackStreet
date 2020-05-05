const express = require('express')
require('../auth')
const utils = require('../utils')

const router = express.Router()

router
  .route('/login')
  .post(utils.auth.login(), async function (req, res, next) {})

router
  .route('/logout')
  .post(utils.auth.isLoggedIn, utils.auth.logout, async function (req, res, next) {})

router
  .route('/isLoggedIn')
  .get(utils.auth.isLoggedIn, async function (req, res, next) {
    res.status(200).json({ isLoggedIn: true })
  })

router
  .route('/loggedAccount')
  .get(utils.auth.isLoggedIn, utils.auth.getLoggedAccount, async function (req, res, next) {})

router
  .route('/isAdmin')
  .get(utils.auth.isLoggedIn, utils.auth.isAdmin, async function (req, res, next) {
    res.status(200).json({ isAdmin: true })
  })

module.exports = router
