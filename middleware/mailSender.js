const nodemailer = require('nodemailer')

function createEmailTransport(senderService) {
    return nodemailer.createTransport({
        service: `${senderService}`, // Service the sender is using
        // The sender's credentials
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
}

async function sendEmailVerify(toEmail, link, senderService) {
    try {
        const transporter = createEmailTransport(senderService)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Verify your email',
            html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`
        }

        await transporter.sendMail(mailOptions)
    } catch (err) {
        return console.log("Couldn't send email: ", err)
    }
}

module.exports = {sendEmailVerify}