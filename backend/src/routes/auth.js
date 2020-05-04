const express = require('express')
require('../auth')
const utils = require('../utils')

const router = express.Router()

router
  .route('/login')
  .post(utils.auth.login(), async function (req, res, next) {})

router
  .route('/logout')
  .post(utils.auth.logout, async function (req, res, next) {})

router
  .route('/isAdmin')
  .post(utils.auth.isLoggedIn, utils.auth.isAdmin, async function (req, res, next) {})

module.exports = router
