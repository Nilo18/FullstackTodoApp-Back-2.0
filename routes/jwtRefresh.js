const express = require('express')
const jwtRefreshRouter = express.Router()
const { resendAccessToken } = require('../controllers/jwtRefreshController.js')
const { authenticate } = require('../middleware/jwtAuthChecker.js')

// Maybe come back here if some issues arise and add authenticate back
jwtRefreshRouter.post('/', resendAccessToken)

module.exports = jwtRefreshRouter