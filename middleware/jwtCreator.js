// JWT consists of header, which specifies the type of the token and the encoding algorithm used, for example:
// {"alg": "HS256", "typ":"JWT"}
// Payload, which consists of the actual user data, like:
// {"username": "johndoe123", "email": "johndoe@gmail.com", "role": "admin", "exp": 1692200000} where exp is the expiration 
// And finally, signature, which is basically the secret key which makes sure that the token wasn't tampered with

const {sign} = require('jsonwebtoken')

function createAccessToken(_username) {
    console.log("Creating access token...")
    return sign({username: `${_username}`}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

function createRefreshToken(_username) {
    console.log("Creating refresh token...")
    return sign({username: `${_username}`}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = {createAccessToken, createRefreshToken}