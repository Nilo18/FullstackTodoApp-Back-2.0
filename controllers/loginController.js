const User = require('../models/user.model.js')
const bcrypt = require('bcryptjs')
const {createAccessToken, createRefreshToken} = require('../middleware/jwtCreator.js')

async function loginUser(req, res, next) {
    try {
        const {username} = req.body;
        // const userPassword = req.body.password
        console.log('Username: ', username)
        // console.log('Password: ', userPassword)
        const compareUsername = await User.findOne({username})
        console.log('Compared username: ', compareUsername)
        if (!compareUsername) {
            return res.status(404).send("User not found.")
        }
        // const comparePassword = await bcrypt.compare(password, userPassword)
        // console.log('Compared password: ', comparePassword)
        // if (!comparePassword) {
        //     return res.status(401).send("Please enter a valid password.")
        // }
        const accessToken = createAccessToken(username);
        console.log('Access Token:', accessToken)

        const refreshToken = createRefreshToken(username);
        console.log('Refresh Token:', refreshToken)

        res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        // res.status(200).json({accessToken})
    } catch (err) {
       return res.status(500).send(err.message);
    }
    next()
}

module.exports = {loginUser}