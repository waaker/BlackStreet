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
    return ftpsServer
  },
  deleteFtpsServers: async function () {
    const ftpsServers = await this.deleteMany({})
    return ftpsServers
  }
}

const model = mongoose.model('FtpsServer', FtpsServerSchema)

module.exports = model
