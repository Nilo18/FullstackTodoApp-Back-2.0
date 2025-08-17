const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')

async function loginUser(req, res, next) {
    try {
        const {username} = req.body;
        const userPassword = req.body.password
        const compareUsername = await User.findOne({username}) // Find the user by the username in mongodb
        if (!compareUsername) {
            return res.status(404).send("User not found.")
        }
        // Compare the given password and the matching user's password using bcrypt
        const comparePassword = await bcrypt.compare(userPassword, compareUsername.password) 
        if (!comparePassword) {
            return res.status(401).send("Please enter a valid password.")
        }
        const accessToken = createAccessToken(username);

        const refreshToken = createRefreshToken(username);

        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // Since we have no other requests on this route, we return the response to exit and avoid multiple responeses error
        // This error is more likely to occur on GET requests
        return res.status(200).json({accessToken}) 
    } catch (err) {
       return res.status(500).send(err.message);
    }
    // next()
}

module.exports = {loginUser}