const express = require('express')
const sftpServerRoutes = require('./sftp_server')

const router = express.Router()

router.use('/sftp_server', sftpServerRoutes)

module.exports = router
