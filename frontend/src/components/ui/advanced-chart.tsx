"use client";

import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChartProps {
  data: any[];
  categories: { key: string; name: string; color?: string }[];
  index: string;
  type?: "line" | "bar" | "area";
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

const goldColors = ["#D4A843", "#F5A623", "#FFD180", "#B8912E", "#9C7A1A", "#FFBE4D"];

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gold-200/50 bg-white/95 px-4 py-3 shadow-soft backdrop-blur-sm animate-scale-in">
      <p className="mb-2 text-xs font-semibold text-navy-800">{String(label)}</p>
      {payload.map((entry: any, idx: number) => (
        <div key={idx} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: String(entry.color) }} />
          <span className="text-muted-foreground">{String(entry.name)}:</span>
          <span className="font-semibold text-foreground">
            {typeof entry.value === "number" ? entry.value.toLocaleString() : String(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function GradientDefs() {
  return (
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D4A843" stopOpacity={0.3} />
        <stop offset="100%" stopColor="#D4A843" stopOpacity={0.01} />
      </linearGradient>
      <linearGradient id="goldGradientLight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F5A623" stopOpacity={0.2} />
        <stop offset="100%" stopColor="#F5A623" stopOpacity={0.01} />
      </linearGradient>
    </defs>
  );
}

export function AdvancedChart({
  data,
  categories,
  index,
  type = "line",
  height = 300,
  className,
  showGrid = true,
  showLegend = true,
}: ChartProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 10, left: 0, bottom: 5 },
    };

    switch (type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gold-200/30" vertical={false} />}
            <XAxis dataKey={index} className="text-xs" tick={{ fill: "hsl(215 16% 47%)" }} axisLine={{ stroke: "hsl(43 20% 85%)" }} tickLine={false} />
            <YAxis className="text-xs" tick={{ fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />}
            {categories.map((cat, i) => (
              <Bar
                key={cat.key}
                dataKey={cat.key}
                name={cat.name}
                fill={cat.color || goldColors[i % goldColors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            ))}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gold-200/30" vertical={false} />}
            <XAxis dataKey={index} className="text-xs" tick={{ fill: "hsl(215 16% 47%)" }} axisLine={{ stroke: "hsl(43 20% 85%)" }} tickLine={false} />
            <YAxis className="text-xs" tick={{ fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />}
            <GradientDefs />
            {categories.map((cat, i) => (
              <Area
                key={cat.key}
                type="monotone"
                dataKey={cat.key}
                name={cat.name}
                stroke={cat.color || goldColors[i % goldColors.length]}
                fill={i % 2 === 0 ? "url(#goldGradient)" : "url(#goldGradientLight)"}
                strokeWidth={2}
                animationDuration={800}
              />
            ))}
          </AreaChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-gold-200/30" vertical={false} />}
            <XAxis dataKey={index} className="text-xs" tick={{ fill: "hsl(215 16% 47%)" }} axisLine={{ stroke: "hsl(43 20% 85%)" }} tickLine={false} />
            <YAxis className="text-xs" tick={{ fill: "hsl(215 16% 47%)" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />}
            {categories.map((cat, i) => (
              <Line
                key={cat.key}
                type="monotone"
                dataKey={cat.key}
                name={cat.name}
                stroke={cat.color || goldColors[i % goldColors.length]}
                strokeWidth={2.5}
                dot={{ fill: cat.color || goldColors[i % goldColors.length], strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                animationDuration={800}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={cn("rounded-xl border border-gold-200/30 bg-card p-6 shadow-soft", className)}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
