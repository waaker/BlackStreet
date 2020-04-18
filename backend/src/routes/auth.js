const express = require('express')
require('../auth')
const utils = require('../utils')

const router = express.Router()

router
  .route('/login')
  .post(utils.auth.login(), async function (req, res, next) {
    res.status(200).json({ status: 'Authentication successful' })
  })

router
  .route('/logout')
  .post(utils.auth.logout, async function (req, res, next) {
    res.status(200).json({ status: 'Unauthentication successful' })
  })

module.exports = router