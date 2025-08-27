const mongoose = require('mongoose')

const resetTokenSchema = mongoose.Schema({
    userId: {
        type: Number,
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

const resetToken = mongoose.model('resetToken', resetTokenSchema)
module.exports =resetToken