const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')
const { model: Account } = require('.')

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
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
