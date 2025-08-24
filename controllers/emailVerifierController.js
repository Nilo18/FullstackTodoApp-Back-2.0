const verificationToken = require('../models/verificationToken.model.js')
const User = require('../models/user.model.js')
const { createAccessToken } = require('../middleware/jwtCreator.js')

async function verifyEmail(req, res, next) {
    try {
        const givenVerToken = req.params.token;

        const storedVerToken = await verificationToken.findOne({givenVerToken})

        if (!storedVerToken) {
            return res.status(401).send('Invalid verification token.')
        }

        if (storedVerToken.expiry < new Date()) {
            return res.status(401).send('Verification token has expired.')
        }

        const newUser = await User.create({userId: storedVerToken.userId, username, email, password})
        console.log(newUser)        
        const accessToken = createAccessToken(storedVerToken.userId, storedVerToken.username)
        return res.status(200).json({accessToken})
    } catch (err) {
        return res.status(500).send("Server error: couldn't verify email.")
    }
}

module.exports = {verifyEmail}