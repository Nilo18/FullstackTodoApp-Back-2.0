const User = require('../models/user.model.js')
const refreshTokenModel = require('../models/refreshToken.js')
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

        const userId = Math.floor(Math.random() * 10000000)
        const newUser = await User.create({userId, username, email, password})

        if (!newUser) {
            return res.status(401).send("Please enter a valid user format.")
        }
        const accessToken = createAccessToken(userId, username)
        const refreshToken = createRefreshToken(userId, username)
        // const storedRefreshToken = await refreshTokenModel.create({token: refreshToken})
        // // Send the refresh token as a cookie
        // res.status(200).cookie('refreshToken', refreshToken, {
        //     httpOnly: true, // Make it httpOnly so js cannot access it 
        //     secure: true,
        //     sameSite: 'None', // changed to none because frontend had to make requests from different domain
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // })
        // Since we have no other requests on this route, we return the response to exit and avoid multiple responeses error
        // Generally, if there are no other request handlers, for example, POST or PUT controllers, best practice is to
        // send the response and return to exit the function
        return res.status(200).json({accessToken}) // Access Token is a string so send it as an object
    } catch (err) {
        return res.status(500).send(err.message)
    }
    // next()
}

module.exports = {addUser}