const STORE_KEY = "fd_mock_state";

const now = () => new Date().toISOString();
const id = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const avatarFor = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const seedState = () => {
  const user = {
    _id: "user_demo",
    name: "Demo User",
    email: "demo@flowdesk.app",
    avatar: avatarFor("Demo User"),
    role: "user",
    preferences: { theme: "dark", notifications: true },
    createdAt: now(),
    updatedAt: now(),
  };

  const projects = [
    {
      _id: "project_launch",
      name: "Launch Plan",
      description: "Prepare FlowDesk for a polished public demo.",
      color: "#6366f1",
      status: "active",
      taskCount: 3,
      completedTaskCount: 1,
      dueDate: addDays(10),
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "project_ops",
      name: "Operations",
      description: "Keep daily execution tidy and visible.",
      color: "#10b981",
      status: "active",
      taskCount: 2,
      completedTaskCount: 1,
      dueDate: addDays(18),
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  const tasks = [
    {
      _id: "task_wireframes",
      title: "Review dashboard metrics",
      description: "Tighten the analytics cards and chart labels.",
      status: "in_progress",
      priority: "high",
      project: "project_launch",
      dueDate: addDays(2),
      tags: ["analytics", "ui"],
      timeEstimate: 90,
      timeSpent: 35,
      subtasks: [],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "task_auth",
      title: "Connect production API",
      description: "Deploy backend and set VITE_API_URL when ready.",
      status: "todo",
      priority: "urgent",
      project: "project_launch",
      dueDate: addDays(1),
      tags: ["deployment"],
      timeEstimate: 60,
      timeSpent: 0,
      subtasks: [],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "task_brand",
      title: "Finalize workspace copy",
      description: "Make labels short and useful.",
      status: "done",
      priority: "medium",
      project: "project_launch",
      dueDate: addDays(-1),
      completedAt: addDays(-1),
      tags: ["content"],
      timeEstimate: 45,
      timeSpent: 45,
      subtasks: [],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "task_standup",
      title: "Plan weekly priorities",
      description: "Pick the three things that matter most.",
      status: "done",
      priority: "low",
      project: "project_ops",
      dueDate: addDays(-2),
      completedAt: addDays(-2),
      tags: ["planning"],
      timeEstimate: 30,
      timeSpent: 30,
      subtasks: [],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      _id: "task_backlog",
      title: "Clean up backlog",
      description: "Archive duplicate tasks and stale ideas.",
      status: "in_review",
      priority: "medium",
      project: "project_ops",
      dueDate: addDays(5),
      tags: ["ops"],
      timeEstimate: 50,
      timeSpent: 20,
      subtasks: [],
      createdAt: now(),
      updatedAt: now(),
    },
  ];

  return {
    users: [{ ...user, password: "demo1234" }],
    activeUserId: null,
    projects,
    tasks,
  };
};

const load = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
    if (parsed?.users?.length) return parsed;
  } catch {
    // Fall through to a fresh demo store.
  }
  const state = seedState();
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  return state;
};

const save = (state) => localStorage.setItem(STORE_KEY, JSON.stringify(state));
const publicUser = ({ password, ...user }) => user;
const ok = (config, data, status = 200) => ({ data, status, statusText: "OK", headers: {}, config });

const fail = (config, status, message) => Promise.reject({
  response: { status, data: { success: false, message }, config },
  config,
  message,
});

const getBody = (config) => {
  if (!config.data) return {};
  return typeof config.data === "string" ? JSON.parse(config.data) : config.data;
};

const currentUser = (state) => state.users.find((user) => user._id === state.activeUserId);

const withProject = (state, task) => {
  if (!task.project) return { ...task, project: null };
  const project = state.projects.find((item) => item._id === task.project);
  return {
    ...task,
    project: project ? { _id: project._id, name: project.name, color: project.color } : null,
  };
};

const recalcProjects = (state) => {
  state.projects = state.projects.map((project) => {
    const tasks = state.tasks.filter((task) => task.project === project._id);
    return {
      ...project,
      taskCount: tasks.length,
      completedTaskCount: tasks.filter((task) => task.status === "done").length,
      updatedAt: now(),
    };
  });
};

const analytics = (state) => {
  const tasks = state.tasks;
  const openTasks = tasks.filter((task) => task.status !== "done");
  const completedTasks = tasks.filter((task) => task.status === "done");
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const labels = [];
  const values = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
    values.push(completedTasks.filter((task) => {
      if (!task.completedAt) return false;
      const completed = new Date(task.completedAt);
      return completed.toDateString() === date.toDateString();
    }).length);
  }

  return {
    overview: {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      inProgressTasks: tasks.filter((task) => task.status === "in_progress").length,
      urgentTasks: openTasks.filter((task) => task.priority === "urgent").length,
      overdueTasks: openTasks.filter((task) => task.dueDate && new Date(task.dueDate) < today).length,
      activeProjects: state.projects.filter((project) => project.status !== "archived").length,
      completionRate: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    },
    weekly: { labels, values },
    priority: ["low", "medium", "high", "urgent"].reduce((acc, priority) => {
      acc[priority] = openTasks.filter((task) => task.priority === priority).length;
      return acc;
    }, {}),
    recent: completedTasks
      .sort((a, b) => new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt))
      .slice(0, 5)
      .map((task) => withProject(state, task)),
    upcoming: openTasks
      .filter((task) => task.dueDate && new Date(task.dueDate) >= today && new Date(task.dueDate) <= nextWeek)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 8)
      .map((task) => withProject(state, task)),
  };
};

export const mockAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 180));

  const state = load();
  const method = (config.method || "get").toLowerCase();
  const path = new URL(config.url, "https://flowdesk.local").pathname.replace(/^\/api/, "");
  const body = getBody(config);

  if (method === "post" && path === "/auth/login") {
    const email = body.email?.toLowerCase().trim();
    const user = state.users.find((item) => item.email === email && item.password === body.password);
    if (!user) return fail(config, 401, "Invalid email or password.");
    state.activeUserId = user._id;
    save(state);
    return ok(config, { success: true, token: `mock_${user._id}`, user: publicUser(user) });
  }

  if (method === "post" && path === "/auth/register") {
    const email = body.email?.toLowerCase().trim();
    if (state.users.some((item) => item.email === email)) {
      return fail(config, 400, "Email already registered.");
    }
    const user = {
      _id: id("user"),
      name: body.name,
      email,
      password: body.password,
      avatar: avatarFor(body.name),
      role: "user",
      preferences: { theme: "dark", notifications: true },
      createdAt: now(),
      updatedAt: now(),
    };
    state.users.push(user);
    state.activeUserId = user._id;
    save(state);
    return ok(config, { success: true, token: `mock_${user._id}`, user: publicUser(user) }, 201);
  }

  const user = currentUser(state);
  if (!user) return fail(config, 401, "Please sign in again.");

  if (method === "get" && path === "/auth/me") {
    return ok(config, { success: true, user: publicUser(user) });
  }

  if (method === "get" && path === "/projects") {
    return ok(config, { success: true, data: state.projects.filter((project) => project.status !== "archived") });
  }

  if (method === "post" && path === "/projects") {
    const project = {
      _id: id("project"),
      name: body.name,
      description: body.description || "",
      color: body.color || "#6366f1",
      status: "active",
      taskCount: 0,
      completedTaskCount: 0,
      dueDate: body.dueDate || null,
      createdAt: now(),
      updatedAt: now(),
    };
    state.projects.unshift(project);
    save(state);
    return ok(config, { success: true, data: project }, 201);
  }

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch && method === "put") {
    const index = state.projects.findIndex((project) => project._id === projectMatch[1]);
    if (index === -1) return fail(config, 404, "Project not found.");
    state.projects[index] = { ...state.projects[index], ...body, updatedAt: now() };
    save(state);
    return ok(config, { success: true, data: state.projects[index] });
  }

  if (projectMatch && method === "delete") {
    state.projects = state.projects.filter((project) => project._id !== projectMatch[1]);
    state.tasks = state.tasks.map((task) => task.project === projectMatch[1] ? { ...task, project: null } : task);
    save(state);
    return ok(config, { success: true, message: "Project deleted." });
  }

  if (method === "get" && path === "/tasks") {
    const params = config.params || {};
    let tasks = state.tasks.map((task) => withProject(state, task));
    if (params.status) tasks = tasks.filter((task) => task.status === params.status);
    if (params.priority) tasks = tasks.filter((task) => task.priority === params.priority);
    if (params.project) tasks = tasks.filter((task) => task.project?._id === params.project);
    if (params.search) tasks = tasks.filter((task) => task.title.toLowerCase().includes(params.search.toLowerCase()));
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return ok(config, { success: true, data: tasks, total: tasks.length, page: 1, pages: 1 });
  }

  if (method === "post" && path === "/tasks") {
    const task = {
      _id: id("task"),
      title: body.title,
      description: body.description || "",
      status: body.status || "todo",
      priority: body.priority || "medium",
      project: body.project || null,
      dueDate: body.dueDate || null,
      completedAt: body.status === "done" ? now() : null,
      tags: body.tags || [],
      timeEstimate: body.timeEstimate || 0,
      timeSpent: body.timeSpent || 0,
      subtasks: body.subtasks || [],
      createdAt: now(),
      updatedAt: now(),
    };
    state.tasks.unshift(task);
    recalcProjects(state);
    save(state);
    return ok(config, { success: true, data: withProject(state, task) }, 201);
  }

  const taskMatch = path.match(/^\/tasks\/([^/]+)$/);
  if (taskMatch && method === "put") {
    const index = state.tasks.findIndex((task) => task._id === taskMatch[1]);
    if (index === -1) return fail(config, 404, "Task not found.");
    const wasDone = state.tasks[index].status === "done";
    const nextTask = { ...state.tasks[index], ...body, project: body.project || null, updatedAt: now() };
    if (nextTask.status === "done" && !wasDone) nextTask.completedAt = now();
    if (nextTask.status !== "done") nextTask.completedAt = null;
    state.tasks[index] = nextTask;
    recalcProjects(state);
    save(state);
    return ok(config, { success: true, data: withProject(state, nextTask) });
  }

  if (taskMatch && method === "delete") {
    state.tasks = state.tasks.filter((task) => task._id !== taskMatch[1]);
    recalcProjects(state);
    save(state);
    return ok(config, { success: true, message: "Task deleted." });
  }

  const stats = analytics(state);
  if (method === "get" && path === "/analytics/overview") return ok(config, { success: true, data: stats.overview });
  if (method === "get" && path === "/analytics/weekly") return ok(config, { success: true, data: stats.weekly });
  if (method === "get" && path === "/analytics/by-priority") return ok(config, { success: true, data: stats.priority });
  if (method === "get" && path === "/analytics/recent") return ok(config, { success: true, data: stats.recent });
  if (method === "get" && path === "/analytics/upcoming") return ok(config, { success: true, data: stats.upcoming });

  if (method === "put" && path === "/users/profile") {
    Object.assign(user, { name: body.name, avatar: avatarFor(body.name), updatedAt: now() });
    save(state);
    return ok(config, { success: true, data: publicUser(user) });
  }

  if (method === "put" && path === "/users/password") {
    if (user.password !== body.currentPassword) return fail(config, 400, "Current password is incorrect.");
    user.password = body.newPassword;
    user.updatedAt = now();
    save(state);
    return ok(config, { success: true, message: "Password changed successfully." });
  }

  return fail(config, 404, "Mock endpoint not found.");
};
