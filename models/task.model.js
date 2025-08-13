const mongoose = require('mongoose')

// A schema is a the scheme/structure of the object (model) we're going to use, it contains info about all of the objects properties
const taskSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: [true, "Please fill enter the task name"]
    }, 

    completed: {
        type: Boolean,
        required: true,
        default: false
    },
}, {timestamps: true}) // timestamps: true sets createdAt and updateAt properties
// This helps us keep track of when the object was created and last updated

const Task = mongoose.model('Task', taskSchema)
module.exports = Task