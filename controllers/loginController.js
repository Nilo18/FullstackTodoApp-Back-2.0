const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')

async function loginUser(req, res, next) {
    try {
        const {username} = req.body;
        const userPassword = req.body.password
        const findByUsername = await User.findOne({username}) // Find the user by the username in mongodb
        if (!findByUsername) {
            return res.status(404).send("User not found.")
        }
        // Compare the given password and the matching user's password using bcrypt
        const comparePassword = await bcrypt.compare(userPassword, findByUsername.password) 
        if (!comparePassword) {
            return res.status(401).send("Please enter a valid password.")
        }
        const accessToken = createAccessToken(findByUsername.userId, username);

        const refreshToken = createRefreshToken(findByUsername.userId, username);

        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // Since we have no other requests on this route, we return the response to exit and avoid multiple responeses error
        // This error is more likely to occur on GET requests
        // Generally, if there are no other request handlers, for example, POST or PUT controllers, best practice is to
        // send the response and return to exit the function
        return res.status(200).json({accessToken}) 
    } catch (err) {
       return res.status(500).send(err.message);
    }
    // next()
}

module.exports = {loginUser}