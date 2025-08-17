const express = require('express')
const homeRouter = express.Router()
const {getAllTasks, addTask, getTaskById, updateTask, deleteTask} = require('../controllers/taskController.js')
const {authenticate} = require('../middleware/jwtAuthChecker.js')

homeRouter.get('/', authenticate, getAllTasks)

homeRouter.post('/', authenticate, addTask)

homeRouter.delete('/', authenticate, deleteTask)

homeRouter.put('/', authenticate, updateTask)

homeRouter.get('/:id', authenticate, getTaskById) // Moved this at the bottom so it doesn't assume routes like /login are ids



module.exports = homeRouter