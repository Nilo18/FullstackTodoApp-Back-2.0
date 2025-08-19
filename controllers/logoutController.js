const refreshTokenModel = require('../models/refreshToken.js')

async function logout(req, res, next) {
    try {
        const { id } = req.body
        const deletedRefreshToken = await refreshTokenModel.findByIdAndDelete(id)
        return res.status(200).json(deletedRefreshToken)
    } catch (err) {
        return res.status(500).send("Error while trying to log out: ", err.message)
    }
}

module.exports = {logout}