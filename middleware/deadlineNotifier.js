const { sendEmailToNotify } = require('./mailSender.js')
const Task = require('../models/task.model.js')
const User = require('../models/user.model.js')

async function checkTaskExpiry() {
    try {
        const now = new Date()
        const upcoming = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await Task.updateMany(
            { notified: { $exists: false } },
            { $set: { notified: false } }
        );

        const expiringTasks = await Task.find({deadline: {$gte: now, $lte: upcoming}, notified: false})
        console.log('The tasks about to expire: ', expiringTasks)
        // Step 1: Group tasks by userId
        const tasksByUser = {};
        expiringTasks.forEach(task => {
            if (!tasksByUser[task.userId]) tasksByUser[task.userId] = [];
            tasksByUser[task.userId].push(task);
        });
        console.log('taskByUser: ', tasksByUser)

        // Step 2: Send one email per user
        for (const userId in tasksByUser) {
            const tasks = tasksByUser[userId];
            const user = await User.findOne({ userId });
            console.log('The found user is: ', user)

            // Build a message listing all tasks
            const taskList = tasks.map(t => `- ${t.taskName}`).join('\n');
            const message = `Following tasks have less than 24 hours until they expire:\n${taskList}`;
            console.log('The message is: ', message)

            // Send a single email
            await sendEmailToNotify(user.email, 'Tasks are expiring', message, 'gmail');

            // Mark all tasks as notified
            for (const task of tasks) {
                task.notified = true;
                await task.save();
            }
    }

    } catch (err) {
        return console.log("Couldn't send reminder: ", err)
    }
}

module.exports = checkTaskExpiry