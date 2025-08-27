const { sendEmailToNotify } = require('./mailSender.js')
const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

async function checkTaskExpiry() {
    try {
        const now = new Date()
        const upcoming = new Date(Date.now() + 24 * 60 * 60 * 1000)

        const expiringTasks = await Task.find({deadline: {$gte: now, $lte: upcoming}, notified: false})
        let expiringTasksNames = []
        let message

        expiringTasks.forEach(async (task) => {
            // expiringTasksNames.push(task.taskName)
            expiringTasksNames = expiringTasks.map(t => `- ${t.taskName}`).join('\n')
            message = `Following tasks have less then 24 hours until they expire: ${expiringTasksNames}\n`
            task.notified = true;
            await task.save()
        });

        const user = await User.findOne({userId: task.userId}) // Find the user whose tasks are about to expire
        await sendEmailToNotify(user.email, 'Tasks are expiring', message, 'gmail')
    } catch (err) {
        return console.log("Couldn't send reminder: ", err)
    }
}

module.exports = checkTaskExpiry