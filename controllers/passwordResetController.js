const { createRefreshToken, createAccessToken } = require('../middleware/jwtCreator.js')
const { sendEmailVerify } = require('../middleware/mailSender.js')
const User = require('../models/user.model.js')
const resetToken = require('../models/resetToken.model.js')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// This controller will be used to receiving the request and sending email verification
async function sendPasswordResetReq(req, res, next) {
    try {
        const { email, username } = req.body

        // runValidators will make sure that the new password is matching the user model's password property in terms of data types
        //, {$set: {password: hashedPassword}}, {new: true, runValidators: true}
        // Use username to find the exact account because one email can have multiple accounts
        // $ denotes an operator in mongoose, $or will search for an user whose username OR email matches
        const foundUser = await User.findOne({username: username, email: email})
        console.log(foundUser)
        if (!foundUser) {
            return res.status(404).json({message: 'User with this username or email was not found'})
        }   

        const newResetToken = crypto.randomBytes(32).toString("hex")
        // Will expire in 15 mins
        await resetToken.create({userId: foundUser.userId, token: newResetToken, expiry: new Date(Date.now() + 15 * 60 * 1000)})
        const verificationLink = `${process.env.BASE_URL}/password-reset/${newResetToken}`
        await sendEmailVerify(email, verificationLink, 'gmail')

        res.status(200).json({message: 'Request sent, check email to verify.'})
        // const accessToken = createAccessToken(foundUser.userId, username)

        // return res.status(200).json({accessToken})
    } catch (err) {
        return res.status(500).send("Couldn't reset password: ", err.message)
    }
    next()
}

// This controller will be used to update the password 
async function resetPassword(req, res, next) {
    try {
        const { password } = req.body
        const givenResetToken = req.params.token

        const foundToken = await resetToken.findOne({token: givenResetToken})

        if (!foundToken) {
            return res.status(401).json({message: 'Reset token is missing.'})
        }

        const newPassword = await bcrypt.hash(password, 10)
        
        const updatedUser = await User.findOneAndUpdate({userId: foundToken.userId}, {$set: {password: newPassword}}, {new: true, runValidators: true})
        // We could also use foundToken.userId, but to keep it consistent, updatedUser.userId will be used
        const accessToken = createAccessToken(updatedUser.userId, updatedUser.username)

        await resetToken.findOneAndDelete({token: givenResetToken})

        return res.status(200).json({accessToken})
    } catch(err) {
        return res.status(500).send(err.message)
    }
}

module.exports = {sendPasswordResetReq, resetPassword}