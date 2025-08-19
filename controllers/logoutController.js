const refreshTokenModel = require('../models/refreshToken.js')

async function logout(req, res, next) {
    try {
        console.log("logout controller is running...")
        const { refreshToken } = req.cookies
        console.log(refreshToken)
        if (!refreshToken) {
            return res.status(401).send('Please provide a valid refresh token.')
        }
        console.log('Deleting refresh token...')
        const deletedRefreshToken = await refreshTokenModel.deleteOne({token: refreshToken})
        console.log('Deleted refresh token: ', deletedRefreshToken)

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
        console.log('Caught the error: ', err.message)
        return res.status(500).send("Error while trying to log out.")
    }
}

module.exports = {logout}