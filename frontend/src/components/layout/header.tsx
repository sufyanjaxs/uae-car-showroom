"use client";

import { Bell, Search, ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, string> = {
  "": "Dashboard",
  "inventory": "Inventory",
  "sales": "Sales",
  "crm": "CRM",
  "finance": "Finance",
  "service": "Service",
  "marketing": "Marketing",
  "hr": "HR",
  "reports": "Reports",
  "documents": "Documents",
  "settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Home", href: "/", icon: Home },
    ...segments.map((seg, i) => ({
      label: breadcrumbMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gold-200/30 bg-white/80 backdrop-blur-xl px-6 transition-all duration-300">
      <nav className="hidden items-center gap-1.5 text-sm md:flex">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
            <span className={cn(
              "flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors duration-200",
              i === breadcrumbs.length - 1
                ? "bg-gold-100 font-medium text-gold-700"
                : "text-muted-foreground hover:text-foreground"
            )}>
              {i === 0 ? <Home className="h-3.5 w-3.5" /> : null}
              {crumb.label}
            </span>
          </div>
        ))}
      </nav>

      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <div className="group relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-gold-500" />
          <input
            type="text"
            placeholder="Search vehicles, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gold-200/40 bg-gold-50/30 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-gold-200/30 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-50 hover:text-gold-600">
            <span className="text-base leading-none" role="img" aria-label="UAE Flag">🇦🇪</span>
            <span>EN</span>
          </button>

          <button className="relative rounded-xl p-2.5 text-muted-foreground transition-all duration-300 hover:bg-gold-50 hover:text-gold-600">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 animate-pulse-slow rounded-full bg-red-500 ring-2 ring-red-200" />
          </button>

          <div className="h-6 w-px bg-gold-200/40" />

          <button className="group flex items-center gap-2 rounded-xl p-1 pr-3 transition-all duration-300 hover:bg-gold-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-glow ring-2 ring-white transition-transform duration-300 group-hover:scale-105">
              <span className="text-xs font-bold text-white">AU</span>
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium leading-tight text-foreground">Admin User</p>
              <p className="text-[10px] leading-tight text-gold-600/70">CEO</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
