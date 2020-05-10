const express = require('express')
const { model: Account } = require('../account')

const router = express.Router()

router
  .route('/')
  .get(async function (req, res, next) {
    try {
      const accounts = await Account.getAccounts()
      res.status(200).json(accounts)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .post(async function (req, res, next) {
    try {
      const account = await Account.createAccount(req.body)
      res.status(201).json(account)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .delete(async function (req, res, next) {
    try {
      const accounts = await Account.deleteAccounts()
      res.status(200).json(accounts)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })

router
  .route('/:accountId')
  .get(async function (req, res, next) {
    try {
      const account = await Account.getAccount(req.params.accountId)
      res.status(200).json(account)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .put(async function (req, res, next) {
    try {
      const account = await Account.updateAccount(req.params.accountId, req.body)
      res.status(200).json(account)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })
  .delete(async function (req, res, next) {
    try {
      const account = await Account.deleteAccount(req.params.accountId)
      res.status(200).json(account)
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })

module.exports = router
