const User = require('../models/user.model.js')
// const refreshTokenModel = require('../models/refreshToken.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')

async function loginUser(req, res, next) {
    try {
        const {username} = req.body;
        const userPassword = req.body.password
        const findByUsername = await User.findOne({username}) // Find the user by the username in mongodb
        if (!findByUsername) {
            return res.status(404).json({message: "User not found."})
        }
        // Compare the given password and the matching user's password using bcrypt
        const comparePassword = await bcrypt.compare(userPassword, findByUsername.password) 
        if (!comparePassword) {
            return res.status(401).json({message: "Please enter the correct password."})
        }
        const accessToken = createAccessToken(findByUsername.userId, username);
        return res.status(200).json({accessToken}) 
    } catch (err) {
       return res.status(500).send(err.message);
    }
    // next()
}

module.exports = {loginUser}