const refreshTokenModel = require('../models/refreshToken.js')

async function logout(req, res, next) {
    try {
        console.log("logout controller is running...")
        const { refreshToken } = req.cookies
        console.log(refreshToken)
        if (!refreshToken) {
            return res.status(401).send('Please provide a valid refresh token.')
        }
        const deletedRefreshToken = await refreshTokenModel.deleteOne(refreshToken)
        console.log(deletedRefreshToken)

        console.log('Clearing cookie...')
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        console.log('Cleared the cookie.')

        // return and end the response here since no other middleware is running on this route
        return res.status(200).json(deletedRefreshToken) 
    } catch (err) {
        return res.status(500).send("Error while trying to log out: ", err.message)
    }
}

module.exports = {logout}