const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Create a new task
router.post("/create", taskController.createTask);

// Get all tasks (optionally filter by status)
router.post("/all", taskController.getAllTasks);

// Get a task by ID
router.post("/get", taskController.getTaskById);

// Update a task
router.put("/update", taskController.updateTask);

// Delete a task
router.delete("/delete", taskController.deleteTask);

module.exports = router;
