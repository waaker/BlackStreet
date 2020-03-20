const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose
const { ObjectId } = Schema.Types

const AccountSchema = new Schema({
  accountName: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  },
  ftpsServers: {
    type: [{
      type: ObjectId,
      ref: 'FtpsServer'
    }]
  }
})

AccountSchema.methods = {
  generateHash: async function (password) {
    this.hash = await bcrypt.hash(password, 10)
  },
  addFtpsServer: async function (ftpsServer) {
    await this.ftpsServers.push(ftpsServer._id)
    await this.save()
  }
}

AccountSchema.statics = {
  getAccounts: async function () {
    const accounts = await this.find()
    return accounts
  },
  createAccount: async function (a) {
    const account = await new this(a)
    await account.generateHash(a.password)
    await account.save()
    return account
  },
  deleteAccounts: async function () {
    const accounts = await this.deleteMany({})
    return accounts
  }
}

const model = mongoose.model('Account', AccountSchema)

module.exports = model
