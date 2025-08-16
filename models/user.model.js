const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a valid username"]
    }, 

    email: {
        type: String,
        required: [true, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Please enter a valid password"]
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;