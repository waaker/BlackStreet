const express = require('express')
const { model: FtpsServer } = require('../ftps_server')
const utils = require('../utils')

const router = express.Router()

router
  .route('/')
  .get(async function (req, res, next) {
    try {
      const ftpsServers = await FtpsServer.getFtpsServers()
      res.status(200).json(ftpsServers)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .post(async function (req, res, next) {
    try {
      const ftpsServer = await FtpsServer.createFtpsServer(req.body)
      res.status(201).json(ftpsServer)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .delete(async function (req, res, next) {
    try {
      const ftpsServers = await FtpsServer.deleteFtpsServers()
      res.status(200).json(ftpsServers)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })

router
  .route('/:serverId')
  .get(async function (req, res, next) {
    try {
      const ftpsServer = await FtpsServer.getFtpsServer(req.params.serverId)
      res.status(200).json(ftpsServer)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .delete(async function (req, res, next) {
    try {
      const ftpsServer = await FtpsServer.deleteFtpsServer(req.params.serverId)
      res.status(200).json(ftpsServer)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })

router
  .route('/:serverId/connect')
  .get(utils.ftps.connect, async function (req, res, next) {})

router
  .route('/:serverId/isConnected')
  .get(utils.ftps.isConnected, async function (req, res, next) {
    res.status(200).json({ isConnected: true })
  })

router
  .route('/:serverId/disconnect')
  .get(utils.ftps.isConnected, utils.ftps.disconnect, async function (req, res, next) {})

router
  .route('/:serverId/list')
  .post(utils.ftps.isConnected, utils.ftps.list, async function (req, res, next) {})

module.exports = router
