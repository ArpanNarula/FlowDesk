import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useQueryClient } from "@tanstack/react-query";

const STATUSES = ["todo", "in_progress", "in_review", "done"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export default function TaskModal({ task, projects = [], onClose }) {
  const qc = useQueryClient();
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    project: task?.project?._id || task?.project || "",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    tags: task?.tags?.join(", ") || "",
    timeEstimate: task?.timeEstimate || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        project: form.project || null,
        dueDate: form.dueDate || undefined,
        timeEstimate: form.timeEstimate ? Number(form.timeEstimate) : 0,
      };

      if (isEdit) {
        await api.put(`/tasks/${task._id}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task created");
      }
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-surface-1 border border-white/8 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-display font-semibold text-white">
              {isEdit ? "Edit Task" : "Create Task"}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <input
                className="input-field text-base font-medium placeholder-slate-600"
                placeholder="Task title..."
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                autoFocus
              />
            </div>

            {/* Description */}
            <textarea
              className="input-field resize-none text-sm"
              placeholder="Add a description..."
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Status</label>
                <select className="input-field" value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Priority</label>
                <select className="input-field" value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Project + Due Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Project</label>
                <select className="input-field" value={form.project} onChange={(e) => set("project", e.target.value)}>
                  <option value="">No project</option>
                  {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Due Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)}
                />
              </div>
            </div>

            {/* Tags + Estimate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1 block"><Tag size={11} /> Tags</label>
                <input
                  className="input-field"
                  placeholder="design, ui, bug"
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 flex items-center gap-1 block"><Clock size={11} /> Estimate (min)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="60"
                  value={form.timeEstimate}
                  onChange={(e) => set("timeEstimate", e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
