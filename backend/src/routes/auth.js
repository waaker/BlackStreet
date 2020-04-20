const express = require('express')
require('../auth')
const utils = require('../utils')

const router = express.Router()

router
  .route('/login')
  .post(utils.auth.login(), async function (req, res, next) {
    const payload = {
      message: 'Authentication successful',
      id: req.user._id,
      accountName: req.user.accountName
    }
    res.status(200).json(payload)
  })

router
  .route('/logout')
  .post(utils.auth.logout, async function (req, res, next) {
    res.status(200).json('Unauthentication successful')
  })

module.exports = router
