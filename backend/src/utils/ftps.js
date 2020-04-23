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
    res.status(200).send(status)
  })

  return next
}

const list = async (req, res, next) => {
  ftpsClients.get(req.params.serverId).list(req.body.path, function (err, list) {
    if (err) throw err
    res.status(200).send(list)
  })
  return next()
}

module.exports = {
  connect,
  list
}
