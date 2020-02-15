const Client = require('ftp')
const config = require('config')
const fs = require('fs')

const sftpClient = new Client()

sftpClient.connect({
  host: config.get('Server_1.host'),
  port: config.get('Server_1.port'),
  user: config.get('Server_1.user'),
  password: config.get('Server_1.password'),
  secure: true,
  secureOptions: {
    ca: [fs.readFileSync(config.get('Server_1.certificate_path'))]
  }
})

module.exports = sftpClient
