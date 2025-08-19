const express = require('express')
const logoutRouter = express.Router()
const { logout } = require('../controllers/logoutController.js')

logoutRouter.delete('/', logout)

module.exports = logoutRouter
