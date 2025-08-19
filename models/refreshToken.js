const mongoose = require('mongoose')

const refreshTokenSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    expires: {
        type: Date,
        required: true
    }
})

const refreshToken = mongoose.model('refreshToken', refreshTokenSchema)
module.exports = refreshToken