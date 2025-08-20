const { createAccessToken } = require('../middleware/jwtCreator')
const jwt = require('jsonwebtoken')

function resendAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(401).send("Bad refresh token request.")
        return
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    console.log('The payload is: ', payload)
    const payLoadUserId = payload.userId
    console.log('Received the userId: ', payLoadUserId)
    const {username} = req.body
    console.log('Sent by: ', username)
    const newAccessToken = jwt.sign({userId: payLoadUserId, username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    console.log('New access token is: ', newAccessToken)
    // console.log(req.userId) // Delete this log later when comfortable
    res.status(200).json({accessToken: newAccessToken})
    next()
}

module.exports = {resendAccessToken}