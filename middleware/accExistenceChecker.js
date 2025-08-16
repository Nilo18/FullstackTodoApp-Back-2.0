const {User} = require('../models/user.model.js')

async function checkIfUserExists(givenUsername, res) {
    if (!givenUsername) {
        return res.status(401).send('Please enter the username in a valid format')
    }
    const user = await User.findOne({username: `${givenUsername}`})
    // If the user is found send a notification about it
    if (user) {
        return res.status(401).send('A user with this username already exists.')
    } 
}

module.exports = {checkIfUserExists}