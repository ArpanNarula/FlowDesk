import { Menu, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/dashboard": { title: "Dashboard", sub: "Good work, let's get things done." },
  "/tasks":     { title: "Tasks",     sub: "Manage and track your work." },
  "/projects":  { title: "Projects",  sub: "Your active project spaces." },
  "/settings":  { title: "Settings",  sub: "Customize your workspace." },
};

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const page = PAGE_TITLES[pathname] || { title: "FlowDesk", sub: "" };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-14 bg-surface-1/80 backdrop-blur-xl border-b border-white/5 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="font-display font-semibold text-white text-base leading-none">{page.title}</h1>
        <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
          {pathname === "/dashboard" ? `${greeting}, ${user?.name?.split(" ")[0]}` : page.sub}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg bg-surface-3 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
          <Bell size={15} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
        <img
          src={user?.avatar}
          alt={user?.name}
          className="w-8 h-8 rounded-full ring-1 ring-white/10"
        />
      </div>
    </header>
  );
}
