import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  urgent: "#f43f5e",
  high:   "#f59e0b",
  medium: "#6366f1",
  low:    "#64748b",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-surface-3 border border-white/10 rounded-lg px-3 py-2 text-xs">
        <p className="text-white font-medium capitalize">{payload[0].name}</p>
        <p className="text-slate-400">{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

export default function PriorityDonut({ data }) {
  const chartData = data
    ? Object.entries(data)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: k, value: v }))
    : [];

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card"
    >
      <div className="mb-5">
        <h3 className="font-display font-semibold text-white text-sm">Open by Priority</h3>
        <p className="text-xs text-slate-500 mt-0.5">Active tasks breakdown</p>
      </div>

      {data ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={chartData} cx={45} cy={45} innerRadius={28} outerRadius={45} dataKey="value" strokeWidth={0}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-bold text-white text-lg">{total}</span>
            </div>
          </div>
          <div className="space-y-1.5 flex-1">
            {Object.entries(COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-slate-400 capitalize">{key}</span>
                </div>
                <span className="text-xs font-medium text-white">{data[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="skeleton h-24 w-full" />
      )}
    </motion.div>
  );
}
