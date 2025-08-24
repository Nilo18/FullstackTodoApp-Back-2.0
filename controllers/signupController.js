const User = require('../models/user.model.js')
// const refreshTokenModel = require('../models/refreshToken.js')
const verificationToken = require('../models/verificationToken.model.js')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { createAccessToken } = require('../middleware/jwtCreator.js')
const { userExists } = require('../middleware/accExistenceChecker.js')

const nodemailer = require('nodemailer')

async function createVerificationToken(userId, username, email) {
    const token = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000)
    const newVerToken = await verificationToken.create({userId, username, email, token, expiry: tokenExpiry})
    console.log(newVerToken)
    console.log(newVerToken.email)
    return newVerToken
}

async function sendEmailVerification(toEmail, verToken) {
    console.log('Email: ', process.env.EMAIL_USER)
    console.log('Password: ', process.env.EMAIL_PASS)   
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Service the sender is using
        // The sender's credentials
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const verificationLink = `${process.env.BASE_URL}/verify-email/${verToken.token}`
    console.log(verificationLink)
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
           return res.status(401).send("Please provide a valid password.")  
        }

        if (await userExists(username)) {
            return res.status(401).send('A user with this username already exists.')
        }

        const userId = Math.floor(Math.random() * 10000000)

        // if (!newUser) {
        //     return res.status(401).send("Please enter a valid user format.")
        // }

        const verToken = await createVerificationToken(userId, username, email)
        await sendEmailVerification(email, verToken)

        // const accessToken = createAccessToken(userId, username)
        // // send the response and return to exit the function
        // return res.status(200).json({accessToken}) // Access Token is a string so send it as an object
        return res.status(200).json({message: 'Signup successful! please verify your email.'})
    } catch (err) {
        return res.status(500).send(err.message)
    }
    // next()
}

module.exports = {addUser}