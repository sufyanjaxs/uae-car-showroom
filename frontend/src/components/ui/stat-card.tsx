import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  const isPositive = trend?.startsWith("+");
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <p className={cn("mt-1 text-sm", isPositive ? "text-green-600" : "text-red-600")}>
            {trend} from last month
          </p>
        )}
      </div>
    </div>
  );
}
