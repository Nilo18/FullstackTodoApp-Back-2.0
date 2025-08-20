const { createAccessToken } = require('../middleware/jwtCreator')
const jwt = require('jsonwebtoken')

function resendAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(401).send("Bad refresh token request.")
        return
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log('The payload is: ', payload)
        const payLoadUserId = payload.userId
        console.log('Received the userId: ', payLoadUserId)
        const {username} = payload
        console.log('Sent by: ', username)
        const newAccessToken = jwt.sign({userId: payLoadUserId, username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        console.log('New access token is: ', newAccessToken)
        // console.log(req.userId) // Delete this log later when comfortable
        res.status(200).json({accessToken: newAccessToken})
        next()
    } catch(err) {
        console.log("Got an error, while trying to send a new access token: ", err.message);
        return res.status(500).send("Couldn't sign a new access token")
    }

}

module.exports = {resendAccessToken}