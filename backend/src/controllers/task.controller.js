const Task = require("../models/Task");
const Project = require("../models/Project");

// GET /api/tasks - Get all tasks for the logged-in user
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, project, search, sort = "-createdAt", page = 1, limit = 50 } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (search) filter.title = { $regex: search, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(Number(limit)).populate("project", "name color"),
      Task.countDocuments(filter),
    ]);

    res.json({ success: true, data: tasks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks - Create a task
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, project, dueDate, tags, timeEstimate, subtasks } = req.body;

    // Verify project belongs to user if specified
    if (project) {
      const proj = await Project.findOne({ _id: project, owner: req.user._id });
      if (!proj) return res.status(404).json({ success: false, message: "Project not found." });
    }

    const task = await Task.create({
      title, description, status, priority, project: project || null,
      dueDate, tags, timeEstimate, subtasks, owner: req.user._id,
    });

    // Update project task count
    if (project) {
      await Project.findByIdAndUpdate(project, { $inc: { taskCount: 1 } });
    }

    await task.populate("project", "name color");
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).populate("project", "name color");
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id - Update a task
const updateTask = async (req, res, next) => {
  try {
    const allowedFields = ["title", "description", "status", "priority", "project", "dueDate", "tags", "timeEstimate", "timeSpent", "subtasks"];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const oldTask = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!oldTask) return res.status(404).json({ success: false, message: "Task not found." });

    // Handle project task count changes
    if (updates.status === "done" && oldTask.status !== "done" && oldTask.project) {
      await Project.findByIdAndUpdate(oldTask.project, { $inc: { completedTaskCount: 1 } });
    } else if (updates.status && updates.status !== "done" && oldTask.status === "done" && oldTask.project) {
      await Project.findByIdAndUpdate(oldTask.project, { $inc: { completedTaskCount: -1 } });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate("project", "name color");

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: "Task not found." });

    // Update project task count
    if (task.project) {
      const dec = { taskCount: -1 };
      if (task.status === "done") dec.completedTaskCount = -1;
      await Project.findByIdAndUpdate(task.project, { $inc: dec });
    }

    res.json({ success: true, message: "Task deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, createTask, getTask, updateTask, deleteTask };
