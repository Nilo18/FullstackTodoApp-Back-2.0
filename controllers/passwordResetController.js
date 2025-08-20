const { createRefreshToken, createAccessToken } = require('../middleware/jwtCreator.js')
const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')

async function passwordResetter(req, res, next) {
    try {
        const { username, password } = req.body
        // runValidators will make sure that the new password is matching the user model's password property in terms of data types
        const foundUser = await User.findOneAndUpdate({username: username}, {$set: password}, {new: true, runValidators: true})
        console.log('The user requesting a reset is: ', foundUser)
        const refreshToken = createRefreshToken(foundUser.userId, username)
        const accessToken = createAccessToken(foundUser.userId, username)

        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({accessToken})
    } catch (err) {
        return res.status(500).send("Couldn't reset password: ", err.message)
    }
}

module.exports = {passwordResetter}