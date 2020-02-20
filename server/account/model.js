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
  ftpsServers: {
    type: [{
      type: ObjectId,
      ref: 'FtpsServer'
    }]
  }
})

const model = mongoose.model('Account', AccountSchema)

module.exports = model
