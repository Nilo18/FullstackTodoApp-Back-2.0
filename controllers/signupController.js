const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')
const { userExists } = require('../middleware/accExistenceChecker.js')

async function addUser(req, res, next) {
    try {
        let { password, username, email } = req.body
        if (!password) {
           return res.status(401).send("Please provide a valid password.")  
        }

        password = await bcrypt.hash(password, 10)

        if (await userExists(username)) {
            return res.status(401).send('A user with this username already exists.')
        }

        const newUser = await User.create({username, email, password})

        if (!newUser) {
            return res.status(401).send("Please enter a valid user format.")
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
        return res.status(200).json({accessToken}) // Access Token is a string so send it as an object
    } catch (err) {
        return res.status(500).send(err.message)
    }
    // next()
}

module.exports = {addUser}