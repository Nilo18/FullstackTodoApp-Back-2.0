const { createAccessToken } = require('../middleware/jwtCreator')
const jwt = require('jsonwebtoken')

function resendAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(401).send("Bad refresh token request.")
        return
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const payLoadUserId = payload.userId
    const {username} = req.body
    const newAccessToken = jwt.sign({payLoadUserId, username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    console.log(newAccessToken)
    console.log(req.userId) // Delete this log later when comfortable
    res.status(200).json(newAccessToken)
    next()
}

module.exports = {resendAccessToken}