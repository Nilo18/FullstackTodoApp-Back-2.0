const mongoose = require('mongoose')

const verificationTokenSchema = mongoose.Schema({
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

const verificationToken = mongoose.model('verificationToken', verificationTokenSchema)
module.exports = verificationToken