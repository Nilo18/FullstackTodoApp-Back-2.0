const express = require('express')
const passwordResetRouter = express.Router()
const { sendPasswordResetReq, resetPassword } = require('../controllers/passwordResetController.js')

passwordResetRouter.post('/', sendPasswordResetReq)

passwordResetRouter.put('/:token', resetPassword)

module.exports = passwordResetRouter