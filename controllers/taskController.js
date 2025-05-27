const Task = require("../models/Task");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Create a new task
exports.createTask = async (req, res) => {
  const { token, title, description, status, dueDate } = req.body;
  if (!token || !title || !dueDate) {
    return res.status(400).send({ status: "error", msg: "Missing required fields" });
  }
  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedUser._id);
    if (!user) throw new Error();

    const task = new Task({ title, description, status, dueDate, createdBy: user._id });
    await task.save();
    res.status(201).send({ status: "ok", msg: "Task created", task });
  } catch (e) {
    res.status(500).send({ status: "error", msg: "some error occurred", e });
  }
};

// Retrieve all tasks for a user (with optional status filter)
exports.getAllTasks = async (req, res) => {
  const { token, status } = req.body;
  if (!token)
    return res.status(400).send({ status: "error", msg: "Token is required" });

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const filter = { createdBy: decodedUser._id };
    if (status) filter.status = status;

    const tasks = await Task.find(filter);
    res.send({ status: "ok", tasks });
  } catch (e) {
    res.status(500).send({ status: "error", msg: "some error occurred", e });
  }
};

// Fetch a single task by ID
exports.getTaskById = async (req, res) => {
  const { token, taskId } = req.body;
  if (!token || !taskId)
    return res.status(400).send({ status: "error", msg: "Token and taskId are required" });

  try { 
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const task = await Task.findOne({ _id: taskId, createdBy: decodedUser._id });

    if (!task) return res.status(404).send({ status: "error", msg: "Task not found" });
    res.send({ status: "ok", task });
  } catch (e) {
    res.status(500).send({ status: "error", msg: "some error occurred", e });
  }
};

// Update specific fields of a task
exports.updateTask = async (req, res) => {
  const { token, taskId, title, description, status, dueDate } = req.body;
  if (!token || !taskId) {
    return res.status(400).send({ status: "error", msg: "Token and taskId are required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    let task = await Task.findOne({ _id: taskId, createdBy: user._id }).lean();

    if (!task) return res.status(404).send({ status: "error", msg: "Task not found" });

    const updatedTask = {
      title: title || task.title,
      description: description || task.description,
      status: status || task.status,
      dueDate: dueDate || task.dueDate,
    };

    task = await Task.findByIdAndUpdate(taskId, updatedTask, { new: true }).lean();
    res.status(200).send({ status: "ok", msg: "Task updated", task });
  } catch (e) {
    if (e.name === "JsonWebTokenError") {
      return res.status(401).send({ status: "error", msg: "Token verification failed" });
    }
    return res.status(500).send({ status: "error", msg: "An error occurred" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { token, taskId } = req.body;
  if (!token || !taskId)
    return res.status(400).send({ status: "error", msg: "Token and taskId are required" });

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const task = await Task.findOneAndDelete({
      _id: taskId,
      createdBy: decodedUser._id,
    });

    if (!task) return res.status(404).send({ status: "error", msg: "Task not found or not authorized" });

    res.send({ status: "ok", msg: "Task deleted" });
  } catch (e) {
    res.status(500).send({ status: "error", msg: "some error occurred", e });
  }
};
