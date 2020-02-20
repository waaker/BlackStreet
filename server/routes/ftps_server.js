const express = require('express')
const ftps = require('../utils')

const router = express.Router()

router
  .route('/')
  .get(async function (req, res) {
    try {
      ftps.list(function (err, list) {
        if (err) throw err
        res.status(200).json(list)
      })
    } catch (e) {
      res.status(500).json(JSON.stringify(e, Object.getOwnPropertyNames(e)))
    }
  })

module.exports = router
