const express = require('express')
const accountRoutes = require('./account')
const authRoutes = require('./auth')
const ftpsServerRoutes = require('./ftps_server')

const router = express.Router()

router.use('/account', accountRoutes)
router.use('/auth', authRoutes)
router.use('/ftps_server', ftpsServerRoutes)

module.exports = router
