const User = require('../models/user.model.js')
// const refreshTokenModel = require('../models/refreshToken.js')
const verificationToken = require('../models/verificationToken.model.js')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { createAccessToken } = require('../middleware/jwtCreator.js')
const { userExists } = require('../middleware/accExistenceChecker.js')

const nodemailer = require('nodemailer')

async function createVerificationToken(userId, username, email, password) {
    const token = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000)
    const newVerToken = await verificationToken.create({userId, username, email, password, token, expiry: tokenExpiry})
    return newVerToken
}

async function sendEmailVerification(toEmail, verToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Service the sender is using
        // The sender's credentials
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const verificationLink = `${process.env.BASE_URL}/verify-email/${verToken.token}`
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Verify your email',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    }

    await transporter.sendMail(mailOptions)
}

async function addUser(req, res, next) {
    try {
        let { password, username, email } = req.body
        if (!password) {
           return res.status(401).json({message: "Please provide a valid password."})  
        }

        if (await userExists(username)) {
            return res.status(401).send('A user with this username already exists.')
        }

        const userId = Math.floor(Math.random() * 10000000)

        const verToken = await createVerificationToken(userId, username, email, password)
        await sendEmailVerification(email, verToken)

        return res.status(200).json({message: 'Signup successful! please verify your email.'})
    } catch (err) {
        return res.status(500).send(err.message)
    }
    // next()
}

module.exports = {addUser}