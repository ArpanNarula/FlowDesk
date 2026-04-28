import { motion } from "framer-motion";
import { CheckSquare, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function ProjectCard({ project, onEdit, index = 0 }) {
  const qc = useQueryClient();
  const progress =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm(`Delete "${project.name}"? Tasks will be unlinked.`)) return;
    try {
      await api.delete(`/projects/${project._id}`);
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card glass-hover group"
    >
      {/* Color bar */}
      <div
        className="h-1 -mx-5 -mt-5 mb-5 rounded-t-xl"
        style={{ backgroundColor: project.color, opacity: 0.7 }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-bold text-sm"
            style={{ backgroundColor: project.color + "22", border: `1px solid ${project.color}44` }}
          >
            <span style={{ color: project.color }}>{project.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">{project.name}</h3>
            <p className="text-xs text-slate-500">
              {project.taskCount} tasks - {progress}% done
            </p>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(project); }}
            className="w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={handleDelete}
            className="w-6 h-6 rounded-md bg-surface-3 flex items-center justify-center text-slate-400 hover:text-rose-400"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {project.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{project.description}</p>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <CheckSquare size={11} />
          {project.completedTaskCount}/{project.taskCount} completed
        </div>
        <Link
          to={`/tasks?project=${project._id}`}
          className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          View tasks <ExternalLink size={10} />
        </Link>
      </div>
    </motion.div>
  );
}
