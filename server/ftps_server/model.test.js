/* eslint-env jest */

const mongoose = require('mongoose')
const config = require('config')
const { model: FtpsServer } = require('.')
const { model: Account } = require('../account')

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
  await FtpsServer.deleteFtpsServers()
})

describe('insert', () => {
  it('should create a ftps server', async () => {
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

    expect(mongooseFtpsServer.host).toEqual(mockFtpsServer.host)
    expect(mongooseFtpsServer.port).toEqual(mockFtpsServer.port)
    expect(mongooseFtpsServer.user).toEqual(mockFtpsServer.user)
    expect(mongooseFtpsServer.password).toEqual(mockFtpsServer.password)
    expect(mongooseFtpsServer.certificate_path).toEqual(mockFtpsServer.certificate_path)
    expect(mongooseFtpsServer.account).toEqual(mongooseAccount._id)
  }, 10000)

  it('should create a ftps server and find it in the ftps servers list', async () => {
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

    await FtpsServer.createFtpsServer(mockFtpsServer)
    const FtpsServers = await FtpsServer.getFtpsServers()

    expect(FtpsServers.length).toEqual(1)
    expect(FtpsServers[0].host).toEqual(mockFtpsServer.host)
    expect(FtpsServers[0].port).toEqual(mockFtpsServer.port)
    expect(FtpsServers[0].user).toEqual(mockFtpsServer.user)
    expect(FtpsServers[0].password).toEqual(mockFtpsServer.password)
    expect(FtpsServers[0].certificate_path).toEqual(mockFtpsServer.certificate_path)
    expect(FtpsServers[0].account).toEqual(mongooseAccount._id)
  }, 10000)
})

describe('delete', () => {
  it('should create a ftps server and delete it', async () => {
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

    await FtpsServer.createFtpsServer(mockFtpsServer)
    let mongooseFtpsServers = await FtpsServer.getFtpsServers()
    expect(mongooseFtpsServers.length).toEqual(1)

    const mongooseDeletedFtpsServers = await FtpsServer.deleteFtpsServers()
    expect(mongooseDeletedFtpsServers.deletedCount).toEqual(1)

    mongooseFtpsServers = await FtpsServer.getFtpsServers()
    expect(mongooseFtpsServers.length).toEqual(0)
  }, 10000)
})
