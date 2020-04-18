/* eslint-env jest */

const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')
const { model: Account } = require('.')
const { model: FtpsServer } = require('../ftps_server')

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

describe('insert', () => {
  afterEach(async () => {
    await Account.deleteAccounts()
  })

  it('should create an account and check its integrity', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    const mongooseAccount = await Account.createAccount(mockAccount)

    expect(mongooseAccount.accountName).toEqual(mockAccount.accountName)
    expect(bcrypt.compareSync(mockAccount.password, mongooseAccount.hash)).toBe(true)
  }, 10000)

  it('should create an account, get it and check its integrity', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    let mongooseAccount = await Account.createAccount(mockAccount)
    mongooseAccount = await Account.getAccount(mongooseAccount._id)

    expect(mongooseAccount.accountName).toEqual(mockAccount.accountName)
    expect(bcrypt.compareSync(mockAccount.password, mongooseAccount.hash)).toBe(true)
  }, 10000)

  it('should create an account, find it in the accounts list and check its integrity', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    await Account.createAccount(mockAccount)
    const mongooseAccounts = await Account.getAccounts()

    expect(mongooseAccounts.length).toEqual(1)
    expect(mongooseAccounts[0].accountName).toEqual(mockAccount.accountName)
    expect(bcrypt.compareSync(mockAccount.password, mongooseAccounts[0].hash)).toBe(true)
  }, 10000)
})

describe('delete', () => {
  afterEach(async () => {
    await Account.deleteAccounts()
  })

  it('should create an account, delete it, check the integrity of the deleted account and ensure deletion', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    const mongooseAccount = await Account.createAccount(mockAccount)
    const mongooseDeletedAccount = await Account.deleteAccount(mongooseAccount._id)
    const mongooseNonexistentAccount = await Account.getAccount(mongooseDeletedAccount._id)

    expect(mongooseDeletedAccount.accountName).toEqual(mockAccount.accountName)
    expect(bcrypt.compareSync(mockAccount.password, mongooseDeletedAccount.hash)).toBe(true)
    expect(mongooseNonexistentAccount).toBeNull()
  }, 10000)

  it('should create an account, delete all accounts and ensure deletion', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    await Account.createAccount(mockAccount)
    let mongooseAccounts = await Account.getAccounts()
    expect(mongooseAccounts.length).toEqual(1)

    const mongooseDeletedAccounts = await Account.deleteAccounts()
    expect(mongooseDeletedAccounts.deletedCount).toEqual(1)

    mongooseAccounts = await Account.getAccounts()
    expect(mongooseAccounts.length).toEqual(0)
  }, 10000)

  it('should create an account, delete it and ensure deletion of related ftps servers', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    const mongooseAccount = await Account.createAccount(mockAccount)

    const mockFtpsServer = {
      host: 'myTestHost',
      port: 21,
      user: 'myTestUser',
      password: 'myTestPassword',
      certificate_path: 'myTestPath',
      account: mongooseAccount._id
    }

    const mongooseFtpsServer = await FtpsServer.createFtpsServer(mockFtpsServer)
    await Account.deleteAccount(mongooseAccount._id)
    const mongooseNonexistentFtpsServer = await FtpsServer.getFtpsServer(mongooseFtpsServer._id)

    expect(mongooseNonexistentFtpsServer).toBeNull()
  }, 10000)

  it('should create an account, delete all accounts and ensure deletion of related ftps servers', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    const mongooseAccount = await Account.createAccount(mockAccount)

    const mockFtpsServer = {
      host: 'myTestHost',
      port: 21,
      user: 'myTestUser',
      password: 'myTestPassword',
      certificate_path: 'myTestPath',
      account: mongooseAccount._id
    }

    const mongooseFtpsServer = await FtpsServer.createFtpsServer(mockFtpsServer)
    await Account.deleteAccounts()
    const mongooseNonexistentFtpsServer = await FtpsServer.getFtpsServer(mongooseFtpsServer._id)

    expect(mongooseNonexistentFtpsServer).toBeNull()
  }, 10000)
})
