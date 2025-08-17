const express = require('express')
const homeRouter = express.Router()
const {getAllTasks, addTask, getTaskById, updateTask, deleteTask} = require('../controllers/taskController.js')

homeRouter.get('/', getAllTasks)

homeRouter.post('/', addTask)

homeRouter.delete('/', deleteTask)

homeRouter.put('/', updateTask)

homeRouter.get('/:id', getTaskById) // Moved this at the bottom so it doesn't assume routes like /login are ids



module.exports = homeRouter