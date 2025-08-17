const express = require('express')
const homeRouter = express.Router()
const {getAllTasks, addTask, getTaskById, updateTask, deleteTask} = require('../controllers/taskController.js')

homeRouter.get('/', getAllTasks)

homeRouter.post('/', addTask)

homeRouter.delete('/', deleteTask)

homeRouter.put('/', updateTask)

homeRouter.get('/:id', getTaskById)



module.exports = homeRouter