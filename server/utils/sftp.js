const Client = require('ftp')
const config = require('config')
const fs = require('fs')

const sftpClient = new Client()

sftpClient.connect({
  host: config.get('General.host'),
  port: config.get('General.port'),
  user: config.get('General.user'),
  password: config.get('General.password'),
  secure: true,
  secureOptions: {
    ca: [fs.readFileSync(config.get('General.certificate_path'))]
  }
})

module.exports = sftpClient
