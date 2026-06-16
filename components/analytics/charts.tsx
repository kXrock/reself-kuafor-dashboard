"use client";

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function Donut({
  newPct,
  returningPct,
}: {
  newPct: number;
  returningPct: number;
}) {
  const data = [
    { name: "Tekrar eden", value: returningPct, color: "#B05B3B" },
    { name: "Yeni", value: newPct, color: "#D9C7A8" },
  ];
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-32 w-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={42}
              outerRadius={62}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="numeral text-2xl font-semibold">%{returningPct}</span>
          <span className="text-[10px] text-muted">sadık</span>
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="font-medium text-ink">%{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TopicBars({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            tickLine={false}
            axisLine={false}
            width={132}
            tick={{ fill: "#5F564C", fontSize: 12 }}
          />
          <Bar dataKey="value" fill="#B05B3B" radius={[0, 3, 3, 0]} maxBarSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? "#B05B3B" : "#C9A98A"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Sparkline({ data }: { data: number[] }) {
  const series = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-12 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
          <Line type="monotone" dataKey="v" stroke="#3F7A57" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniHBars({ data }: { data: { name: string; pct: number }[] }) {
  return (
    <ul className="space-y-2.5">
      {data.map((d) => (
        <li key={d.name}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-ink">{d.name}</span>
            <span className="numeral font-medium text-muted">%{d.pct}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-hairline">
            <div className="h-full rounded-full bg-clay" style={{ width: `${d.pct}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
