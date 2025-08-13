const express = require('express')
const homeRouter = express.Router()
const {getAllTasks, addTask, getTaskById, updateTask, deleteTask} = require('../controllers/taskController.js')

homeRouter.get('/', getAllTasks)

homeRouter.post('/', addTask)

homeRouter.delete('/', deleteTask)

homeRouter.get('/:id', getTaskById)

homeRouter.put('/', updateTask)



module.exports = homeRouter