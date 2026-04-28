import { motion } from "framer-motion";
import { Calendar, AlertTriangle } from "lucide-react";
import { formatDate, PRIORITY_CONFIG, isOverdue } from "../../utils/helpers";

export default function UpcomingTasks({ tasks }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-white text-sm">Upcoming Deadlines</h3>
          <p className="text-xs text-slate-500 mt-0.5">Next 7 days</p>
        </div>
        <Calendar size={15} className="text-slate-500" />
      </div>

      {!tasks ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-12 w-full" />)}
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No upcoming deadlines</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => {
            const p = PRIORITY_CONFIG[task.priority];
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <div
                key={task._id}
                className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                  overdue ? "border-rose-500/20 bg-rose-500/5" : "border-white/5 bg-surface-2/50 hover:bg-surface-2"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.dot} ${task.priority === "urgent" ? "urgent-pulse" : ""}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{task.title}</p>
                  {task.project && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.project.color }} />
                      <span className="text-xs text-slate-500">{task.project.name}</span>
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${overdue ? "text-rose-400" : "text-slate-500"}`}>
                  {overdue && <AlertTriangle size={11} />}
                  {formatDate(task.dueDate)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
