const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')

async function addUser(req, res, next) {
    try {
        const { password, username, email } = req.body
        // console.log(email)
        // console.log(password)
        // console.log(username)
        if (password) {
            password = await bcrypt.hash(password, 10)
        } else {
            res.status(401).send("Please provide a valid password.") 
            return
        }
        const newUser = User.create(req.body)
        console.log(`Added new user: ${newUser}`)
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
        res.status(500).send("Couldn't complete signup.")
    }
    next()
}

module.exports = {addUser}