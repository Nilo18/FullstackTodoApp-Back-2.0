const verificationToken = require('../models/verificationToken.model.js')
const User = require('../models/user.model.js')
const { createAccessToken } = require('../middleware/jwtCreator.js')
const bcrypt = require('bcryptjs')

async function verifyEmail(req, res, next) {
    try {
        const givenVerToken = req.params.token;

        const storedVerToken = await verificationToken.findOne({token: givenVerToken})

        if (!storedVerToken) {
            return res.status(401).send('Invalid verification token.')
        }

        if (storedVerToken.expiry < new Date()) {
            return res.status(401).send('Verification token has expired.')
        }
        
        const hashedPassword = await bcrypt.hash(storedVerToken.password, 10)

        const possibleUser = await User.findOne({userId: storedVerToken.userId})
        if (!possibleUser) {
                const newUser = await User.create({
                userId: storedVerToken.userId,
                username: storedVerToken.username, 
                email: storedVerToken.email,
                password: hashedPassword
            })
        }
   
        const accessToken = createAccessToken(storedVerToken.userId, storedVerToken.username)
        // This is an atomic operation to ensure the deletion happens all at once
        await verificationToken.findOneAndDelete({token: givenVerToken})
        return res.status(200).json({accessToken})
    } catch (err) {
        return res.status(500).send("Server error: couldn't verify email.")
    }
}

module.exports = {verifyEmail}