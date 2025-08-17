const Task = require('../models/task.model.js')

async function getAllTasks(req, res, next) {
    try {
        console.log(req.userId)
        if (!req.userId) {
            return res.status(401).send('userId is invalid.')
        }
        const tasks = await Task.find({userId: Number(req.userId)})
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).send(error.message)
    }
    next()
}

async function addTask(req, res, next) {
    try {
        console.log("userId: ", req.userId)
        // Since authenticate middleware assigned the req.userId from the JWT token,
        // we can use req.userId in the following middlewares (controllers) like this one
        const task = await Task.create({...req.body, userId: req.userId})
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
        // console.log(reqId)   
        const reqBody = req.body
        // console.log(reqBody)
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
        res.status(500).send(error)
    }
    next()
}

module.exports = {getAllTasks, addTask, getTaskById, updateTask, deleteTask}