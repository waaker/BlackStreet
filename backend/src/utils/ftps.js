const ftp = require('basic-ftp')
const fs = require('fs')

const { model: FtpsServer } = require('../ftps_server')

var ftpsClients = new Map()

const connect = async (req, res, next) => {
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

const isConnected = (req, res, next) => {
  if (ftpsClients.has(req.params.serverId)) {
    if (!ftpsClients.get(req.params.serverId).closed) {
      return next()
    } else {
      ftpsClients.delete(req.params.serverId)
      return res.status(200).json({ isConnected: false })
    }
  } else {
    return res.status(200).json({ isConnected: false })
  }
}

const disconnect = async (req, res, next) => {
  try {
    await ftpsClients.get(req.params.serverId).close()
    ftpsClients.delete(req.params.serverId)
    res.status(200).send({ connected: false })
  } catch (err) {
    res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
}

const list = async (req, res, next) => {
  try {
    const list = await ftpsClients.get(req.params.serverId).list(req.body.path)
    res.status(200).send(list)
  } catch (err) {
    res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
}

module.exports = {
  connect,
  isConnected,
  disconnect,
  list
}
