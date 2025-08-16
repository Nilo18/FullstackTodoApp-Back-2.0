const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')

async function addUser(req, res, next) {
    try {
        let { password, username, email } = req.body
        if (!password) {
            res.status(401).send("Please provide a valid password.") 
            return
        }
        password = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password})
        if (!newUser) {
            res.status(401).send("Please enter a valid user format.")
            return
        }
        const accessToken = createAccessToken(username)
        const refreshToken = createRefreshToken(username)
        // Send the refresh token as a cookie
        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true, // Make it httpOnly so js cannot access it 
            secure: true,
            sameSite: 'Strict', // Ensures that other websites can't send the cookies
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json(accessToken)
        // res.status(200).json(newUser);
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}

module.exports = {addUser}