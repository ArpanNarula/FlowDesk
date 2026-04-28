import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, color = "brand", delta, index = 0 }) {
  const colorMap = {
    brand:   { bg: "bg-brand-500/10",   icon: "text-brand-400",   ring: "ring-brand-500/20" },
    emerald: { bg: "bg-emerald-500/10", icon: "text-emerald-400", ring: "ring-emerald-500/20" },
    amber:   { bg: "bg-amber-500/10",   icon: "text-amber-400",   ring: "ring-amber-500/20" },
    rose:    { bg: "bg-rose-500/10",    icon: "text-rose-400",    ring: "ring-rose-500/20" },
    violet:  { bg: "bg-violet-500/10",  icon: "text-violet-400",  ring: "ring-violet-500/20" },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card glass-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
          <Icon size={17} className={c.icon} />
        </div>
        {delta !== undefined && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${delta >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"}`}>
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
        )}
      </div>
      <div className="stat-number mb-0.5">{value ?? <div className="skeleton h-8 w-16" />}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </motion.div>
  );
}
