const { sendEmailToNotify } = require('./mailSender.js')
const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

async function checkTaskExpiry() {
    try {
        const now = new Date()
        const upcoming = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const expiringTasks = await Task.find({deadline: {$gte: now, $lte: upcoming}, notified: false})

        expiringTasks.forEach(async (task) => {
            const user = await User.findOne({userId: task.userId}) // Find the user whose tasks are about to expire
            await sendEmailToNotify(user.email, 'Tasks are expiring', `Following tasks have less then 24 hours until they expire: ${task.taskName}\n`, 'gmail')
            task.notified = true;
            await task.save()
        });
    } catch (err) {
        return console.log("Couldn't send reminder: ", err)
    }
}

module.exports = checkTaskExpiry