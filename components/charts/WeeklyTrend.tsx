"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function WeeklyTrend({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8A7E70", fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#8A7E70", fontSize: 11 }}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "rgba(176,91,59,0.06)" }}
            contentStyle={{
              borderRadius: 5,
              border: "1px solid #E3DACC",
              backgroundColor: "#FBF8F3",
              fontSize: 12,
              color: "#2B2520",
            }}
            labelStyle={{ color: "#8A7E70" }}
            formatter={(v: number) => [`${v} randevu`, ""]}
          />
          <Bar dataKey="count" fill="#B05B3B" radius={[3, 3, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
