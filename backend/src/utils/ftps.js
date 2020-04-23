const Client = require('ftp')
const fs = require('fs')

const { model: FtpsServer } = require('../ftps_server')

var ftpsClients = new Map()

const connect = async (req, res, next) => {
  const ftpsServer = await FtpsServer.getFtpsServer(req.params.serverId)
  const ftpsClient = new Client()

  ftpsClient.connect({
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

  ftpsClient.status(function (err, status) {
    if (err) {
      res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    }
    res.status(200).send({ status: status })
  })
}

const isConnected = (req, res, next) => {
  if (ftpsClients.has(req.params.serverId)) {
    return res.status(200).json({ isConnected: true })
  } else {
    return res.status(200).json({ isConnected: false })
  }
}

const disconnect = (req, res, next) => {
  try {
    console.log('a')
    ftpsClients.get(req.params.serverId).end()
    console.log('b')
    ftpsClients.delete(req.params.serverId)
    res.status(200).json('Disconnection successful')
  } catch (err) {
    console.log('c')
    res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  }
  return next()
}

const list = async (req, res, next) => {
  ftpsClients.get(req.params.serverId).list(req.body.path, function (err, list) {
    if (err) {
      res.status(500).json(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    }
    res.status(200).send(list)
  })
  return next()
}

module.exports = {
  connect,
  isConnected,
  disconnect,
  list
}
