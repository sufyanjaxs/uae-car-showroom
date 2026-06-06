"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Jan", revenue: 4500000, sales: 35 },
  { name: "Feb", revenue: 5200000, sales: 42 },
  { name: "Mar", revenue: 4800000, sales: 38 },
  { name: "Apr", revenue: 6100000, sales: 48 },
  { name: "May", revenue: 5500000, sales: 45 },
  { name: "Jun", revenue: 6700000, sales: 52 },
  { name: "Jul", revenue: 7200000, sales: 58 },
  { name: "Aug", revenue: 5800000, sales: 44 },
  { name: "Sep", revenue: 6900000, sales: 55 },
  { name: "Oct", revenue: 7500000, sales: 60 },
  { name: "Nov", revenue: 8200000, sales: 65 },
  { name: "Dec", revenue: 7800000, sales: 62 },
];

export function DashboardChart() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Revenue & Sales Overview</h3>
        <p className="text-sm text-muted-foreground">Monthly performance for 2026</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2}
              name="Revenue (AED)"
              yAxisId={0}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#16a34a"
              strokeWidth={2}
              name="Vehicles Sold"
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
