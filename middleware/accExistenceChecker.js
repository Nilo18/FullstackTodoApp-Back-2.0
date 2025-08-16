const {User} = require('../models/user.model.js')

async function userExists(givenUsername) {
    const user = await User.findOne({username: `${givenUsername}`})
    // If the user is found send a notification about it
    if (user) {
        return true
    } else {
        return false;
    }
}

module.exports = {userExists}