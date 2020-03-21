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

describe('insert', () => {
  afterEach(async () => {
    await Account.deleteAccounts()
  })

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
    expect(mongooseFtpsServer.account).toEqual(mockFtpsServer.account)
  }, 10000)

  it('should create a ftps server and get it', async () => {
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

    let mongooseFtpsServer = await FtpsServer.createFtpsServer(mockFtpsServer)
    mongooseFtpsServer = await FtpsServer.getFtpsServer(mongooseFtpsServer._id)

    expect(mongooseFtpsServer.host).toEqual(mockFtpsServer.host)
    expect(mongooseFtpsServer.port).toEqual(mockFtpsServer.port)
    expect(mongooseFtpsServer.user).toEqual(mockFtpsServer.user)
    expect(mongooseFtpsServer.password).toEqual(mockFtpsServer.password)
    expect(mongooseFtpsServer.certificate_path).toEqual(mockFtpsServer.certificate_path)
    expect(mongooseFtpsServer.account).toEqual(mockFtpsServer.account)
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
    expect(FtpsServers[0].account).toEqual(mockFtpsServer.account)
  }, 10000)

  it('should create a ftps server and link it to the account', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    let mongooseAccount = await Account.createAccount(mockAccount)

    const mockFtpsServer = {
      host: 'myTestHost',
      port: 21,
      user: 'myTestUser',
      password: 'myTestPassword',
      certificate_path: 'myTestPath',
      account: mongooseAccount._id
    }

    const mongooseFtpsServer = await FtpsServer.createFtpsServer(mockFtpsServer)
    mongooseAccount = await Account.findById(mongooseFtpsServer.account)

    expect(mongooseAccount.ftpsServers.length).toEqual(1)
    expect(mongooseAccount.ftpsServers[0]).toEqual(mongooseFtpsServer._id)
  }, 10000)
})

describe('delete', () => {
  afterEach(async () => {
    await Account.deleteAccounts()
  })

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

    const mongooseFtpsServer = await FtpsServer.createFtpsServer(mockFtpsServer)
    const mongooseDeletedFtpsServer = await FtpsServer.deleteFtpsServer(mongooseFtpsServer._id)

    expect(mongooseDeletedFtpsServer.host).toEqual(mockFtpsServer.host)
    expect(mongooseDeletedFtpsServer.port).toEqual(mockFtpsServer.port)
    expect(mongooseDeletedFtpsServer.user).toEqual(mockFtpsServer.user)
    expect(mongooseDeletedFtpsServer.password).toEqual(mockFtpsServer.password)
    expect(mongooseDeletedFtpsServer.certificate_path).toEqual(mockFtpsServer.certificate_path)
    expect(mongooseDeletedFtpsServer.account).toEqual(mockFtpsServer.account)
  }, 10000)

  it('should create a ftps server and delete all servers', async () => {
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

  it('should create a ftps server, delete it and unlink it to the account', async () => {
    const mockAccount = {
      accountName: 'myTestAccount',
      password: 'myTestPassword',
      ftpsServers: []
    }

    let mongooseAccount = await Account.createAccount(mockAccount)

    const mockFtpsServer = {
      host: 'myTestHost',
      port: 21,
      user: 'myTestUser',
      password: 'myTestPassword',
      certificate_path: 'myTestPath',
      account: mongooseAccount._id
    }

    const mongooseFtpsServer = await FtpsServer.createFtpsServer(mockFtpsServer)
    const mongooseDeletedFtpsServer = await FtpsServer.deleteFtpsServer(mongooseFtpsServer._id)
    mongooseAccount = await Account.findById(mongooseDeletedFtpsServer.account)

    expect(mongooseAccount.ftpsServers.length).toEqual(0)
  }, 10000)
})
