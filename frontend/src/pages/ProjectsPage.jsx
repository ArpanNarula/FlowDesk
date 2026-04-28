import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FolderOpen } from "lucide-react";
import api from "../utils/api";
import ProjectCard from "../components/dashboard/ProjectCard";
import ProjectModal from "../components/dashboard/ProjectModal";

const fetchProjects = () => api.get("/projects").then((r) => r.data.data);

export default function ProjectsPage() {
  const { data: projects, isLoading } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Workspaces</p>
          <h2 className="font-display font-bold text-2xl text-white mt-0.5">
            Projects
            {projects && (
              <span className="ml-2 text-base font-normal text-slate-500">({projects.length})</span>
            )}
          </h2>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={15} /> New Project
        </motion.button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-44 w-full rounded-xl" />)}
        </div>
      ) : projects?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={22} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No projects yet</p>
          <p className="text-sm text-slate-600 mt-1">Create a project to organize your tasks</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary mt-4 text-sm">
            <Plus size={14} className="inline mr-1" /> Create Project
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} onEdit={setEditProject} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {(showCreate || editProject) && (
        <ProjectModal
          project={editProject}
          onClose={() => { setShowCreate(false); setEditProject(null); }}
        />
      )}
    </div>
  );
}
