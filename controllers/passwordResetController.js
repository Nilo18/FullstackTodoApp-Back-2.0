const { createRefreshToken, createAccessToken } = require('../middleware/jwtCreator.js')
const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')

async function passwordResetter(req, res, next) {
    try {
        const { username, password } = req.body

        if (!username) {
            return res.status(401).send({message: 'Please provide a valid username'})
        }

        if (!password) {
            return res.status(401).send({message:'Please provide a valid password'})
        }

        const hashedPassword = await bcrypt.hash(password, 10) // Encrypt the new password

        // runValidators will make sure that the new password is matching the user model's password property in terms of data types
        const foundUser = await User.findOneAndUpdate({username: username}, {$set: {password: hashedPassword}}, {new: true, runValidators: true})
        if (!foundUser) {
            return res.status(404).send('User not found')
        }   
        // const refreshToken = createRefreshToken(foundUser.userId, username)
        const accessToken = createAccessToken(foundUser.userId, username)

        return res.status(200).json({accessToken})
    } catch (err) {
        return res.status(500).send("Couldn't reset password: ", err.message)
    }
}

module.exports = {passwordResetter}