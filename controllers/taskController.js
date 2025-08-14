const Task = require('../models/task.model.js')

async function getAllTasks(req, res, next) {
    try {
        const tasks = await Task.find({})
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
    next()
}

async function addTask(req, res, next) {
    try {
        const task = await Task.create(req.body)
        if (!task) {
            return res.status(401).send('Please enter the task in a valid format.')
        }
        res.status(200).json(task)
    } catch (error) {
        res.status(500).send(error)
    }
    next()
}

async function getTaskById(req, res, next) {
    try {
        const reqId = req.params.id
        const task = await Task.findById(reqId)
        if (!task) {
            return res.status(404).send("Couldn't find the task.")
        }
        res.status(200).json(task)
    } catch (error) {
        res.status(500).send(error)
    }
    next()
}

async function updateTask(req, res, next) {
    try {
        const reqId = req.body.id
        console.log(reqId)   
        const reqBody = req.body
        console.log(reqBody)
        // {new: true} tells mongoose to always send the updated request instead of sending before update first and after update next
        const updatedTask = await Task.findByIdAndUpdate(reqId, reqBody, {new: true}) 
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).send(error)
    }
    next()  
}

async function deleteTask(req, res, next) {
    try {
        const reqBodyId = req.body.id;
        const deletedTask = await Task.findByIdAndDelete(reqBodyId)
        res.status(200).json(deletedTask)
    } catch (error) {
        res.status(500).send("Couldn't delete.")
    }
    next()
}

module.exports = {getAllTasks, addTask, getTaskById, updateTask, deleteTask}