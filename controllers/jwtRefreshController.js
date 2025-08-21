const { createAccessToken } = require('../middleware/jwtCreator')
const jwt = require('jsonwebtoken')

function resendAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(401).send("Bad refresh token request.")
        return
    }
    
    try {
        // Rely entirely on the refresh token to retrieve the necessary data for signing a new access token
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const payLoadUserId = payload.userId
        const {username} = payload
        const newAccessToken = jwt.sign({userId: payLoadUserId, username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        res.status(200).json({accessToken: newAccessToken})
        next()
    } catch(err) {
        console.log("Got an error, while trying to send a new access token: ", err.message);
        return res.status(500).send("Couldn't sign a new access token")
    }

}

module.exports = {resendAccessToken}