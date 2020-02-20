const express = require('express')
const ftpsServerRoutes = require('./ftps_server')

const router = express.Router()

router.use('/ftps_server', ftpsServerRoutes)

module.exports = router
