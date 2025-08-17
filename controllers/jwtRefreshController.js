const { createAccessToken } = require('../middleware/jwtCreator')

function resendAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res.status(401).send("Bad refresh token request.")
        return
    }
    const {username} = req.body
    const newAccessToken = createAccessToken(req.userId, username)
    console.log(req.userId) // Delete this log later when comfortable
    res.status(200).json(newAccessToken)
    next()
}

module.exports = {resendAccessToken}