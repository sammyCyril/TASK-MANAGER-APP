const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/create", taskController.createTask);

router.post("/all", taskController.getAllTasks);

router.post("/get", taskController.getTaskById);

router.put("/update", taskController.updateTask);

router.delete("/delete", taskController.deleteTask);

module.exports = router;
