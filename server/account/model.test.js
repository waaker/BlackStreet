/* eslint-env jest */

const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')
const { model: Account } = require('.')

beforeAll(async () => {
  await mongoose.connect(`mongodb://${config.get('Database.uri')}:${config.get('Database.port')}/${config.get('Database.name')}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})

afterEach(async () => {
  await Account.deleteAccounts()
})

describe('insert', () => {
  it('should create an account', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    const mongooseAccount = await Account.createAccount(mockAccount)

    expect(mongooseAccount.accountName).toEqual(mockAccount.accountName)
    expect(bcrypt.compareSync(mockAccount.password, mongooseAccount.hash)).toBe(true)
  }, 10000)
})
