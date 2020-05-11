const ftp = require('basic-ftp')
const fs = require('fs')

const { model: FtpsServer } = require('../ftps_server')

var ftpsClients = new Map()

const connectMW = async (req, res, next) => {
  const ftpsServer = await FtpsServer.getFtpsServer(req.params.serverId)
  const ftpsClient = new ftp.Client()

  try {
    const resp = await ftpsClient.access({
      host: ftpsServer.host,
      port: ftpsServer.port,
      user: ftpsServer.user,
      password: ftpsServer.password,
      secure: true,
      secureOptions: {
        ca: [fs.readFileSync(ftpsServer.certificate_path)]
      }
    })

    ftpsClients.set(req.params.serverId, ftpsClient)

    if (resp.code === 220) {
      res.status(200).send({ connected: true })
    } else {
      throw new Error('Response code is not 220')
    }
  } catch (err) {
    res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
}

const isConnectedMW = (req, res, next) => {
  if (ftpsClients.has(req.params.serverId)) {
    if (!ftpsClients.get(req.params.serverId).closed) {
      return next()
    } else {
      ftpsClients.delete(req.params.serverId)
      return res.status(500).json({ isConnected: false })
    }
  } else {
    return res.status(500).json({ isConnected: false })
  }
}

const disconnectMW = async (req, res, next) => {
  try {
    await ftpsClients.get(req.params.serverId).close()
    ftpsClients.delete(req.params.serverId)
    res.status(200).send({ connected: false })
  } catch (err) {
    res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
}

const listMW = async (req, res, next) => {
  try {
    await ftpsClients.get(req.params.serverId).cd(req.body.path)
    const list = await ftpsClients.get(req.params.serverId).list()
    res.status(200).send(list)
  } catch (err) {
    res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
}

module.exports = {
  connectMW,
  isConnectedMW,
  disconnectMW,
  listMW
}
