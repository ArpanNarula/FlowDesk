const Project = require("../models/Project");
const Task = require("../models/Task");

// GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ owner: req.user._id, status: { $ne: "archived" } }).sort("-createdAt");
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description, color, icon, dueDate } = req.body;
    const project = await Project.create({ name, description, color, icon, dueDate, owner: req.user._id });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });

    // Unlink tasks from this project
    await Task.updateMany({ project: project._id, owner: req.user._id }, { $unset: { project: "" } });

    res.json({ success: true, message: "Project deleted." });
  } catch (error) {
    next(error);
  }
};

// GET /api/projects/:id/tasks
const getProjectTasks = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });

    const tasks = await Task.find({ project: project._id, owner: req.user._id }).sort("-createdAt");
    res.json({ success: true, data: tasks, project });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject, getProjectTasks };
