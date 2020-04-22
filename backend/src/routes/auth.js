const express = require('express')
require('../auth')
const utils = require('../utils')

const router = express.Router()

router
  .route('/login')
  .post(utils.auth.login(), async function (req, res, next) {
    const payload = {
      message: 'Authentication successful',
      id: req.user._id
    }
    res.status(200).json(payload)
  })

router
  .route('/logout')
  .post(utils.auth.logout, async function (req, res, next) {
    res.status(200).json('Unauthentication successful')
  })

router
  .route('/isAdmin')
  .post(utils.auth.isAdmin, async function (req, res, next) {
    res.status(200).json({ isAdmin: true })
  })

module.exports = router
