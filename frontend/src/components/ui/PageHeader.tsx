"use client";

import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  gradient = false,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 animate-fade-in", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-1.5 text-sm">
          <Home className="h-3.5 w-3.5 text-muted-foreground" />
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 transition-colors",
                  i === breadcrumbs.length - 1
                    ? "bg-gold-100 font-medium text-gold-700"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className={cn(
              "text-2xl font-bold tracking-tight sm:text-3xl",
              gradient && "text-gradient-gold"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
