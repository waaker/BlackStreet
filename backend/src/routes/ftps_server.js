const express = require('express')
const { model: FtpsServer } = require('../ftps_server')
const utils = require('../utils')

const router = express.Router()

router
  .route('/')
  .get(
    utils.auth.isAdminMW,
    async function (req, res, next) {
      try {
        const ftpsServers = await FtpsServer.getFtpsServers()
        res.status(200).json(ftpsServers)
      } catch (e) {
        res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      }
    }
  )
  .post(
    utils.auth.isLoggedInMW,
    async function (req, res, next) {
      try {
        const ftpsServer = await FtpsServer.createFtpsServer(req.body, req.user)
        res.status(201).json(ftpsServer)
      } catch (e) {
        res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      }
    }
  )
  .delete(
    utils.auth.isAdminMW,
    async function (req, res, next) {
      try {
        const ftpsServers = await FtpsServer.deleteFtpsServers()
        res.status(200).json(ftpsServers)
      } catch (e) {
        res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      }
    }
  )

router
  .route('/:serverId')
  .get(
    utils.auth.isServerOwnerOrAdminMW,
    async function (req, res, next) {
      try {
        const ftpsServer = await FtpsServer.getFtpsServer(req.params.serverId)
        res.status(200).json(ftpsServer)
      } catch (e) {
        res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      }
    }
  )
  .put(
    utils.auth.isServerOwnerOrAdminMW,
    async function (req, res, next) {
      try {
        const ftpsServer = await FtpsServer.updateFtpsServer(req.params.serverId, req.body)
        res.status(200).json(ftpsServer)
      } catch (e) {
        res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      }
    }
  )
  .delete(
    utils.auth.isServerOwnerOrAdminMW,
    async function (req, res, next) {
      try {
        const ftpsServer = await FtpsServer.deleteFtpsServer(req.params.serverId)
        res.status(200).json(ftpsServer)
      } catch (e) {
        res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
      }
    }
  )

router
  .route('/:serverId/connect')
  .get(
    utils.auth.isServerOwnerOrAdminMW,
    utils.ftps.connectMW,
    async function (req, res, next) {}
  )

router
  .route('/:serverId/isConnected')
  .get(
    utils.auth.isServerOwnerOrAdminMW,
    utils.ftps.isConnectedMW,
    async function (req, res, next) {
      res.status(200).json({ isConnected: true })
    }
  )

router
  .route('/:serverId/disconnect')
  .get(
    utils.auth.isServerOwnerOrAdminMW,
    utils.ftps.isConnectedMW,
    utils.ftps.disconnectMW,
    async function (req, res, next) {}
  )

router
  .route('/:serverId/list')
  .post(
    utils.auth.isServerOwnerOrAdminMW,
    utils.ftps.isConnectedMW,
    utils.ftps.listMW,
    async function (req, res, next) {}
  )

module.exports = router
