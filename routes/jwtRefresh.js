const express = require('express')
const jwtRefreshRouter = express.Router()
const { resendAccessToken } = require('../controllers/jwtRefreshController.js')
const { authenticate } = require('../middleware/jwtAuthChecker.js')

jwtRefreshRouter.post('/', authenticate, resendAccessToken)

module.exports = jwtRefreshRouter