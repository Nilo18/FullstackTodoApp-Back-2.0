const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')

async function passwordResetter(req, res, next) {
    try {
        const { username, password } = req.body
        // runValidators will make sure that the new password is matching the user model's password property in terms of data types
        const foundUser = await User.findOneAndUpdate({username: username}, {$set: password}, {new: true, runValidators: true})
        console.log('The user requesting a reset is: ', foundUser)
        return res.status(200).json({foundUser})
    } catch (err) {
        return res.status(500).send("Couldn't reset password: ", err.message)
    }
}

module.exports = {passwordResetter}