import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, FolderOpen,
  Settings, LogOut, X, Zap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/tasks",     icon: CheckSquare,     label: "Tasks" },
  { to: "/projects",  icon: FolderOpen,      label: "Projects" },
  { to: "/settings",  icon: Settings,        label: "Settings" },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("See you later!");
    navigate("/login");
  };

  return (
    <div className="w-64 h-full bg-surface-1 border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">FlowDesk</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <NavLink
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                    : "text-slate-400 hover:text-white hover:bg-surface-3"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300"} />
                  {label}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full ring-1 ring-white/10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
