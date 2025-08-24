const refreshTokenModel = require('../models/refreshToken.js')

// async function logout(req, res, next) {
//     try {
//         const { refreshToken } = req.cookies
//         // if (!refreshToken) {
//         //     return res.status(401).send('Please provide a valid refresh token.')
//         // }
//         const deletedRefreshToken = await refreshTokenModel.deleteOne({token: refreshToken})
//         res.clearCookie('refreshToken', {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict'
//         })

//         // return and end the response here since no other middleware is running on this route
//         return res.status(200).json(deletedRefreshToken) 
//     } catch (err) {            
//         console.log('Caught the error: ', err.message)
//         return res.status(500).send("Error while trying to log out.")
//     }
// }

// module.exports = {logout}