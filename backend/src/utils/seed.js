require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");

const connectDB = require("../config/db");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([User.deleteMany(), Task.deleteMany(), Project.deleteMany()]);

  console.log("Creating demo user...");
  const user = await User.create({
    name: "Alex Morgan",
    email: "demo@flowdesk.app",
    password: "demo1234",
  });

  console.log("Creating projects...");
  const projects = await Project.insertMany([
    { name: "Website Redesign", color: "#6366f1", icon: "globe", owner: user._id, taskCount: 0, completedTaskCount: 0 },
    { name: "Mobile App", color: "#ec4899", icon: "smartphone", owner: user._id, taskCount: 0, completedTaskCount: 0 },
    { name: "Backend API", color: "#10b981", icon: "server", owner: user._id, taskCount: 0, completedTaskCount: 0 },
  ]);

  const [web, mobile, api] = projects;

  console.log("Creating tasks...");
  const now = new Date();
  const day = (n) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };
  const past = (n) => { const d = new Date(now); d.setDate(d.getDate() - n); return d; };

  const tasks = [
    { title: "Design new landing page hero section", status: "done", priority: "high", project: web._id, owner: user._id, completedAt: past(2), tags: ["design", "ui"] },
    { title: "Implement authentication flow", status: "done", priority: "urgent", project: api._id, owner: user._id, completedAt: past(1), tags: ["auth"] },
    { title: "Build task management API", status: "in_progress", priority: "high", project: api._id, owner: user._id, dueDate: day(2), tags: ["api", "backend"] },
    { title: "Create onboarding screens", status: "in_progress", priority: "medium", project: mobile._id, owner: user._id, dueDate: day(3), tags: ["mobile", "ux"] },
    { title: "Write unit tests for auth module", status: "in_review", priority: "medium", project: api._id, owner: user._id, dueDate: day(1), tags: ["testing"] },
    { title: "Integrate push notifications", status: "todo", priority: "low", project: mobile._id, owner: user._id, dueDate: day(10), tags: ["mobile"] },
    { title: "Setup CI/CD pipeline", status: "todo", priority: "high", project: api._id, owner: user._id, dueDate: day(5) },
    { title: "Responsive mobile breakpoints", status: "todo", priority: "medium", project: web._id, owner: user._id, dueDate: day(4) },
    { title: "Performance audit and optimization", status: "todo", priority: "urgent", project: web._id, owner: user._id, dueDate: day(1) },
    { title: "Database indexing and query optimization", status: "done", priority: "high", project: api._id, owner: user._id, completedAt: past(3), tags: ["db", "perf"] },
    { title: "Dark mode implementation", status: "done", priority: "medium", project: mobile._id, owner: user._id, completedAt: past(4) },
    { title: "App Store submission checklist", status: "todo", priority: "low", project: mobile._id, owner: user._id, dueDate: day(14) },
  ];

  await Task.insertMany(tasks);

  // Update project stats
  for (const proj of projects) {
    const total = await Task.countDocuments({ project: proj._id });
    const done = await Task.countDocuments({ project: proj._id, status: "done" });
    await Project.findByIdAndUpdate(proj._id, { taskCount: total, completedTaskCount: done });
  }

  console.log("\n✅ Seed complete!");
  console.log("Demo login: demo@flowdesk.app / demo1234");
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
