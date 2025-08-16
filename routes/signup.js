const express = require('express')
const signupRouter = express.Router()
const {addUser} = require('../controllers/signupController.js')

signupRouter.post('/', addUser);

module.exports = signupRouter