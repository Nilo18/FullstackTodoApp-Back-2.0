const express = require('express')
const loginRouter = express.Router()
const {loginUser} = require('../controllers/loginController.js')

loginRouter.post('/', loginUser)

module.exports = loginRouter