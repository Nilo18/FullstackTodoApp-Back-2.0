const express = require('express')
const mongoose = require('mongoose')
const app = express()
const homeRouter = require('./routes/homeRoute.js')
const signupRouter = require('./routes/signup.js')
const emailVerifyRouter = require('./routes/emailVerifier.js')
const loginRouter = require('./routes/login.js')
const passwordResetRouter = require('./routes/passwordReset.js')
const cors = require('cors')
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser')
const nodeCron = require('node-cron')
const checkTaskExpiry = require('./middleware/deadlineNotifier.js')
require('dotenv').config()

// Main mongoose methods:
// For getting everything - .find({})
// For adding a new item - .create(req.body)
// For getting a single item - .findById(req.params.id)
// For updating an item - .findByIdAndUpdate(req.params.id, req.body)
// For deleting an item - .findByIdAndDelete(req.params.id)


// Allows all origins, otherwise browser would block requests because frontend and backend are on different addresses
// This is only fine during development
// For production we need to make the API accessible only to our domain
// For example:
// app.use(cors({
//   origin: 'https://your-frontend-domain.com'
// }));
app.use(cors({
    origin: ['http://localhost:4200', 'https://taskmanager-pi-wine.vercel.app'], 
    credentials: true // Allow cookies to be parsed
})) 
app.use(express.json())
app.use(cookieParser())
app.use('/signup', signupRouter)
app.use('/verify-email', emailVerifyRouter)
app.use('/login', loginRouter)
app.use('/password-reset', passwordResetRouter)
app.use('/', homeRouter) // Moved the home route at the bottom because /:id caused issues, such as confusing /login for /:id

// This way the app handles async flow with more modern approach instead of using promises
// And also starts accepting requests only after connecting to the database
async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to the database');
        app.listen(3000, () => {
            console.log(`App is listening on port ${PORT}`)
        })
    } catch (error) {
        console.log('Failed to connect to the database: ', error)
    }
}


start()

// The first argument means 
// that it will do the cron job at the 0th minute of every hour, for every month, every day and every week 
nodeCron.schedule('0 * * * *', () => {
    console.log('Checking task deadlines...')
    checkTaskExpiry() // Await isn't stricty necessary because checkTaskExpiry doesn't return a promise
})