const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const FtpsServerSchema = new Schema({
  host: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  certificate_path: {
    type: String
  },
  account: {
    type: ObjectId,
    ref: 'Account',
    required: true
  }
})

FtpsServerSchema.statics = {
  getFtpsServers: async function () {
    const ftpsServers = await this.find()
    return ftpsServers
  },
  createFtpsServer: async function (f) {
    const ftpsServer = await this.create(f)
    const account = await mongoose.model('Account').findById(ftpsServer.account)
    await account.addFtpsServer(ftpsServer)
    return ftpsServer
  },
  deleteFtpsServers: async function () {
    let ftpsServers = await this.find()
    for (let i = 0; i < ftpsServers.length; i++) {
      const account = await mongoose.model('Account').findById(ftpsServers[i].account)
      await account.removeFtpsServer(ftpsServers[i])
    }
    ftpsServers = await this.deleteMany({})
    return ftpsServers
  },
  getFtpsServer: async function (id) {
    const ftpsServer = await this.findById(id)
    return ftpsServer
  },
  deleteFtpsServer: async function (id) {
    const ftpsServer = await this.findByIdAndDelete(id)
    const account = await mongoose.model('Account').findById(ftpsServer.account)
    await account.removeFtpsServer(ftpsServer)
    return ftpsServer
  }
}

const model = mongoose.model('FtpsServer', FtpsServerSchema)

module.exports = model
