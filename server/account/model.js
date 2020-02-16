const mongoose = require('mongoose')
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
  sftpServers: {
    type: [{
      type: ObjectId,
      ref: 'SftpServer'
    }]
  }
})

const model = mongoose.model('Account', AccountSchema)

module.exports = model
