import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import api from "../utils/api";
import TaskCard from "../components/dashboard/TaskCard";
import TaskModal from "../components/dashboard/TaskModal";
import { useSearchParams } from "react-router-dom";

const fetchTasks = (params) => api.get("/tasks", { params }).then((r) => r.data);
const fetchProjects = () => api.get("/projects").then((r) => r.data.data);

const STATUSES  = ["", "todo", "in_progress", "in_review", "done"];
const PRIORITIES = ["", "urgent", "high", "medium", "low"];

const STATUS_LABELS  = { "": "All Status", todo: "To Do", in_progress: "In Progress", in_review: "In Review", done: "Done" };
const PRIORITY_LABELS = { "": "All Priority", urgent: "Urgent", high: "High", medium: "Medium", low: "Low" };

export default function TasksPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectFilter, setProjectFilter] = useState(searchParams.get("project") || "");
  const [editTask, setEditTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const params = {};
  if (search)        params.search  = search;
  if (status)        params.status  = status;
  if (priority)      params.priority = priority;
  if (projectFilter) params.project  = projectFilter;

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => fetchTasks(params),
  });

  const { data: projects } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });

  const tasks = data?.data || [];
  const hasFilters = search || status || priority || projectFilter;

  const clearFilters = () => {
    setSearch(""); setStatus(""); setPriority(""); setProjectFilter("");
  };

  // Group tasks by status for kanban-like summary
  const groups = {
    todo:        tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    in_review:   tasks.filter((t) => t.status === "in_review"),
    done:        tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Board</p>
          <h2 className="font-display font-bold text-2xl text-white mt-0.5">
            All Tasks
            {data?.total !== undefined && (
              <span className="ml-2 text-base font-normal text-slate-500">({data.total})</span>
            )}
          </h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={15} /> New Task
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-field pl-8 text-xs py-2"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input-field text-xs py-2 w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>

        <select
          className="input-field text-xs py-2 w-auto"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
        </select>

        {projects?.length > 0 && (
          <select
            className="input-field text-xs py-2 w-auto"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        )}

        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1.5 bg-surface-3 rounded-lg border border-white/5 transition-colors">
            <X size={11} /> Clear
          </button>
        )}
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton h-20 w-full rounded-xl" />)}
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal size={22} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No tasks found</p>
          <p className="text-sm text-slate-600 mt-1">
            {hasFilters ? "Try different filters" : "Create your first task to get started"}
          </p>
          {!hasFilters && (
            <button onClick={() => setShowCreate(true)} className="btn-primary mt-4 text-sm">
              <Plus size={14} className="inline mr-1" /> Create Task
            </button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-2.5">
            {tasks.map((task, i) => (
              <TaskCard key={task._id} task={task} onEdit={setEditTask} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {(showCreate || editTask) && (
        <TaskModal
          task={editTask}
          projects={projects || []}
          onClose={() => { setShowCreate(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}
