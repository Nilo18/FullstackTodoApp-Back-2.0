const express = require('express')
const passwordResetRouter = express.Router()
const { passwordResetter } = require('../controllers/passwordResetController.js')

passwordResetRouter.put('/', passwordResetter)

module.exports = passwordResetRouter