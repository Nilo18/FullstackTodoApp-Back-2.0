const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    // req.headers.authorization contains the full token: Bearer <token> 
    // Split the token in the empty space and get the index 1 (actual value)
    const token = req.headers.authorization?.split(" ")[1]
    console.log(token) 
    if (!token) {
        return res.status(401).send("No token provided.")
    }
    // We check if the token is valid
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(400).send('Invalid Token')
        }
        req.userId = decoded.userId // We assign whatever value we want from the token to the request
        next()
    })
}

module.exports = {authenticate}