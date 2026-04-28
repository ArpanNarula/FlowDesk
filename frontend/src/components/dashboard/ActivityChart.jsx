import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-3 border border-white/10 rounded-lg px-3 py-2 text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-brand-400 font-semibold">{payload[0].value} tasks completed</p>
      </div>
    );
  }
  return null;
};

export default function ActivityChart({ data }) {
  const chartData = data
    ? data.labels.map((l, i) => ({ day: l, tasks: data.values[i] }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-white text-sm">Weekly Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Tasks completed each day</p>
        </div>
        <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20">Last 7 days</span>
      </div>

      {data ? (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              width={24}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)", radius: 6 }} />
            <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.9} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="skeleton h-40 w-full" />
      )}
    </motion.div>
  );
}
