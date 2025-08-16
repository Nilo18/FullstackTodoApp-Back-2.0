const express = require('express')
const jwtRefreshRouter = express.Router()
const { resendAccessToken } = require('../controllers/jwtRefreshController.js')

jwtRefreshRouter.post('/', resendAccessToken)

module.exports = jwtRefreshRouter