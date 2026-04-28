import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

export const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM d");
};

export const formatRelative = (date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isOverdue = (date, status) => {
  if (!date || status === "done") return false;
  return isPast(new Date(date));
};

export const PRIORITY_CONFIG = {
  urgent: { label: "Urgent", color: "text-rose-400", bg: "bg-rose-500/10", dot: "bg-rose-400", border: "border-rose-500/30" },
  high:   { label: "High",   color: "text-amber-400", bg: "bg-amber-500/10", dot: "bg-amber-400", border: "border-amber-500/30" },
  medium: { label: "Medium", color: "text-blue-400",  bg: "bg-blue-500/10",  dot: "bg-blue-400",  border: "border-blue-500/30" },
  low:    { label: "Low",    color: "text-slate-400", bg: "bg-slate-500/10", dot: "bg-slate-400", border: "border-slate-500/30" },
};

export const STATUS_CONFIG = {
  todo:        { label: "To Do",       color: "text-slate-400", bg: "bg-slate-500/10" },
  in_progress: { label: "In Progress", color: "text-brand-400", bg: "bg-brand-500/10" },
  in_review:   { label: "In Review",   color: "text-violet-400", bg: "bg-violet-500/10" },
  done:        { label: "Done",        color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export const PROJECT_COLORS = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b",
  "#06b6d4", "#8b5cf6", "#f43f5e", "#3b82f6",
];

export const clsx = (...args) =>
  args.filter(Boolean).join(" ");
