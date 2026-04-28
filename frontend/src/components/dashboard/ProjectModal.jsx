import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { PROJECT_COLORS } from "../../utils/helpers";

export default function ProjectModal({ project, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!project;

  const [form, setForm] = useState({
    name:        project?.name        || "",
    description: project?.description || "",
    color:       project?.color       || PROJECT_COLORS[0],
    dueDate:     project?.dueDate ? project.dueDate.slice(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Project name is required");
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/projects/${project._id}`, form);
        toast.success("Project updated");
      } else {
        await api.post("/projects", form);
        toast.success("Project created");
      }
      qc.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          className="w-full max-w-md bg-surface-1 border border-white/8 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Color preview strip */}
          <div className="h-1.5" style={{ backgroundColor: form.color }} />

          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-display font-semibold text-white">
              {isEdit ? "Edit Project" : "New Project"}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Project Name</label>
              <input
                className="input-field"
                placeholder="My Awesome Project"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Description</label>
              <textarea
                className="input-field resize-none text-sm"
                placeholder="What is this project about?"
                rows={2}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("color", c)}
                    className="w-7 h-7 rounded-lg transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      outline: form.color === c ? `2px solid ${c}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Due Date (optional)</label>
              <input
                type="date"
                className="input-field"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
                style={form.color ? { backgroundColor: form.color, borderColor: form.color } : {}}
              >
                {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
