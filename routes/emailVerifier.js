const express = require('express')
const emailVerifyRouter = express.Router()
const { verifyEmail } = require('../controllers/emailVerifierController.js')

emailVerifyRouter.get('/:token', verifyEmail)

module.exports = emailVerifyRouter