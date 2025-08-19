const mongoose = require('mongoose')

const refreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

const refreshToken = mongoose.model('refreshToken', refreshTokenSchema)
module.exports = refreshToken