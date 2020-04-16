const express = require('express')
const accountRoutes = require('./account')
const ftpsServerRoutes = require('./ftps_server')

const router = express.Router()

router.use('/account', accountRoutes)
router.use('/ftps_server', ftpsServerRoutes)

module.exports = router
