const mongoose = require('mongoose')

const verificationToken = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    token: {
        type: String,
        required: true
    },

    expiry: {
        type: Date,
        required: true
    }
})

mongoose.model('verificationToken', verificationToken)
module.exports = verificationToken