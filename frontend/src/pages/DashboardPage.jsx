import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, TrendingUp, CheckCircle2, Clock, AlertTriangle, FolderOpen, Zap } from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api";
import StatCard from "../components/dashboard/StatCard";
import ActivityChart from "../components/dashboard/ActivityChart";
import PriorityDonut from "../components/dashboard/PriorityDonut";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";
import TaskModal from "../components/dashboard/TaskModal";

const fetchOverview = () => api.get("/analytics/overview").then((r) => r.data.data);
const fetchWeekly  = () => api.get("/analytics/weekly").then((r) => r.data.data);
const fetchPriority = () => api.get("/analytics/by-priority").then((r) => r.data.data);
const fetchUpcoming = () => api.get("/analytics/upcoming").then((r) => r.data.data);
const fetchProjects = () => api.get("/projects").then((r) => r.data.data);
const fetchRecent   = () => api.get("/analytics/recent").then((r) => r.data.data);

export default function DashboardPage() {
  const [showCreateTask, setShowCreateTask] = useState(false);

  const { data: overview } = useQuery({ queryKey: ["analytics", "overview"], queryFn: fetchOverview });
  const { data: weekly }   = useQuery({ queryKey: ["analytics", "weekly"],   queryFn: fetchWeekly });
  const { data: priority } = useQuery({ queryKey: ["analytics", "priority"], queryFn: fetchPriority });
  const { data: upcoming } = useQuery({ queryKey: ["analytics", "upcoming"], queryFn: fetchUpcoming });
  const { data: projects } = useQuery({ queryKey: ["projects"],              queryFn: fetchProjects });
  const { data: recent }   = useQuery({ queryKey: ["analytics", "recent"],   queryFn: fetchRecent });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Overview</p>
          <h2 className="font-display font-bold text-2xl text-white mt-0.5">Your Workspace</h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCreateTask(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={15} />
          New Task
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks"     value={overview?.totalTasks}     icon={CheckCircle2} color="brand"   index={0} />
        <StatCard label="In Progress"     value={overview?.inProgressTasks} icon={Clock}       color="violet"  index={1} />
        <StatCard label="Active Projects" value={overview?.activeProjects}  icon={FolderOpen}  color="emerald" index={2} />
        <StatCard label="Urgent Open"     value={overview?.urgentTasks}    icon={AlertTriangle} color="rose"   index={3} />
      </div>

      {/* Completion Rate Banner */}
      {overview && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-white">Overall Completion Rate</span>
              <span className="font-display font-bold text-emerald-400">{overview.completionRate}%</span>
            </div>
            <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overview.completionRate}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {overview.completedTasks} of {overview.totalTasks} tasks completed
              {overview.overdueTasks > 0 && (
                <span className="text-rose-400 ml-2">- {overview.overdueTasks} overdue</span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityChart data={weekly} />
        </div>
        <PriorityDonut data={priority} />
      </div>

      {/* Bottom Row: Upcoming + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingTasks tasks={upcoming} />

        {/* Recently Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap size={14} className="text-brand-400" />
            <h3 className="font-display font-semibold text-white text-sm">Recently Completed</h3>
          </div>

          {!recent ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-10 w-full" />)}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No completed tasks yet</p>
          ) : (
            <div className="space-y-2">
              {recent.map((task) => (
                <div key={task._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate line-through decoration-slate-600">{task.title}</p>
                  </div>
                  {task.project && (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.project.color }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {showCreateTask && (
        <TaskModal projects={projects || []} onClose={() => setShowCreateTask(false)} />
      )}
    </div>
  );
}
