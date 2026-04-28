const Task = require("../models/Task");
const Project = require("../models/Project");

// GET /api/analytics/overview - Main dashboard stats
const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalTasks, completedTasks, inProgressTasks, urgentTasks, projects] = await Promise.all([
      Task.countDocuments({ owner: userId }),
      Task.countDocuments({ owner: userId, status: "done" }),
      Task.countDocuments({ owner: userId, status: "in_progress" }),
      Task.countDocuments({ owner: userId, priority: "urgent", status: { $ne: "done" } }),
      Project.countDocuments({ owner: userId, status: "active" }),
    ]);

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      owner: userId,
      status: { $ne: "done" },
      dueDate: { $lt: new Date() },
    });

    // Completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        urgentTasks,
        overdueTasks,
        activeProjects: projects,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/weekly - Tasks completed per day for the last 7 days
const getWeeklyActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const days = [];
    const labels = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      const count = await Task.countDocuments({
        owner: userId,
        status: "done",
        completedAt: { $gte: start, $lte: end },
      });
      days.push(count);
      labels.push(start.toLocaleDateString("en-US", { weekday: "short" }));
    }

    res.json({ success: true, data: { labels, values: days } });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/by-status - Task distribution by status
const getByStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await Task.aggregate([
      { $match: { owner: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusMap = { todo: 0, in_progress: 0, in_review: 0, done: 0 };
    result.forEach(({ _id, count }) => { if (statusMap[_id] !== undefined) statusMap[_id] = count; });

    res.json({ success: true, data: statusMap });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/by-priority
const getByPriority = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await Task.aggregate([
      { $match: { owner: userId, status: { $ne: "done" } } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const priorityMap = { low: 0, medium: 0, high: 0, urgent: 0 };
    result.forEach(({ _id, count }) => { if (priorityMap[_id] !== undefined) priorityMap[_id] = count; });

    res.json({ success: true, data: priorityMap });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/recent - Recently completed tasks
const getRecentActivity = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user._id, status: "done" })
      .sort("-completedAt")
      .limit(5)
      .populate("project", "name color");

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/upcoming - Tasks due in next 7 days
const getUpcoming = async (req, res, next) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks = await Task.find({
      owner: req.user._id,
      status: { $ne: "done" },
      dueDate: { $gte: now, $lte: nextWeek },
    })
      .sort("dueDate")
      .limit(8)
      .populate("project", "name color");

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getWeeklyActivity, getByStatus, getByPriority, getRecentActivity, getUpcoming };
