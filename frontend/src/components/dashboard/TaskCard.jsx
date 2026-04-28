import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, isOverdue } from "../../utils/helpers";

export default function TaskCard({ task, onEdit, index = 0 }) {
  const qc = useQueryClient();
  const [toggling, setToggling] = useState(false);

  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];
  const overdue = isOverdue(task.dueDate, task.status);
  const isDone = task.status === "done";

  const toggleDone = async (e) => {
    e.stopPropagation();
    setToggling(true);
    try {
      await api.put(`/tasks/${task._id}`, {
        status: isDone ? "todo" : "done",
      });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    } catch {
      toast.error("Failed to update task");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      className={`card glass-hover group cursor-pointer ${isDone ? "opacity-60" : ""}`}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start gap-3">
        {/* Completion toggle */}
        <button
          onClick={toggleDone}
          disabled={toggling}
          className={`mt-0.5 flex-shrink-0 transition-colors ${isDone ? "text-emerald-400" : "text-slate-600 hover:text-brand-400"}`}
        >
          {isDone ? <CheckCircle2 size={17} /> : <Circle size={17} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className={`text-sm font-medium leading-snug ${isDone ? "line-through text-slate-500" : "text-white"}`}>
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {/* Priority badge */}
            <span className={`badge ${p.bg} ${p.color} border ${p.border} text-[10px]`}>
              <span className={`w-1 h-1 rounded-full ${p.dot} ${task.priority === "urgent" ? "urgent-pulse" : ""}`} />
              {p.label}
            </span>

            {/* Status badge */}
            <span className={`badge ${s.bg} ${s.color} text-[10px]`}>
              {s.label}
            </span>

            {/* Project */}
            {task.project && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: task.project.color }} />
                <span className="text-[10px] text-slate-500">{task.project.name}</span>
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-[10px] ${overdue ? "text-rose-400" : "text-slate-500"}`}>
                <Calendar size={10} />
                {formatDate(task.dueDate)}
              </div>
            )}

            {/* Tags */}
            {task.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] text-slate-500 bg-surface-3 px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
