const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const assert = require('assert')
const { Schema } = mongoose
const { ObjectId } = Schema.Types
const { ROLES } = require('../utils')

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
  role: {
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
  validatePassword: async function (password) {
    return bcrypt.compare(password, this.hash)
  },
  addFtpsServer: async function (ftpsServer) {
    await this.ftpsServers.push(ftpsServer._id)
    await this.save()
  },
  removeFtpsServer: async function (ftpsServer) {
    await this.ftpsServers.splice(this.ftpsServers.indexOf(ftpsServer._id), 1)
    await this.save()
  }
}

AccountSchema.statics = {
  getAccounts: async function () {
    const accounts = await this.find()
    return accounts
  },
  createAccount: async function (a) {
    assert(Object.values(ROLES).includes(a.role))
    const account = await new this(a)
    await account.generateHash(a.password)
    await account.save()
    return account
  },
  deleteAccounts: async function () {
    let accounts = await this.find()
    for (let i = 0; i < accounts.length; i++) {
      const ftpsServersToDelete = accounts[i].ftpsServers.slice()
      for (let i = 0; i < ftpsServersToDelete.length; i++) {
        await mongoose.model('FtpsServer').deleteFtpsServer(ftpsServersToDelete[i])
      }
    }
    accounts = await this.deleteMany({})
    return accounts
  },
  getAccount: async function (id) {
    const account = await this.findById(id)
    return account
  },
  updateAccount: async function (id, a) {
    assert(Object.values(ROLES).includes(a.role))
    const account = await this.findByIdAndUpdate(id, a, {
      new: true
    })
    await account.generateHash(a.password)
    await account.save()
    return account
  },
  deleteAccount: async function (id) {
    let account = await this.findById(id)
    const ftpsServersToDelete = account.ftpsServers.slice()
    for (let i = 0; i < ftpsServersToDelete.length; i++) {
      await mongoose.model('FtpsServer').deleteFtpsServer(ftpsServersToDelete[i])
    }
    account = await this.findByIdAndDelete(id)
    return account
  },
  getNbAdmin: async function () {
    const admins = await this.find(
      { role: 'admin' }
    )
    return admins.length
  }
}

const model = mongoose.model('Account', AccountSchema)

module.exports = model
