"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Car, Users, Receipt, Wrench, BarChart3,
  Settings, ShoppingCart, FileText, MessageSquare, Building2,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Car },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Finance", href: "/finance", icon: Receipt },
  { name: "Service", href: "/service", icon: Wrench },
  { name: "Marketing", href: "/marketing", icon: MessageSquare },
  { name: "HR", href: "/hr", icon: Building2 },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-500 ease-in-out overflow-hidden",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="flex h-full flex-col">
          <div className="flex-1" />
          <div className="h-1/2 bg-gradient-to-b from-transparent via-uae-green/30 to-transparent" />
          <div className="h-1/3 bg-gradient-to-b from-transparent via-uae-red/20 to-transparent" />
          <div className="h-1/4 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
        </div>
      </div>
      <div className="relative z-10 flex h-14 items-center border-b border-gold-200/30 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 px-4">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 shadow-glow">
              <Car className="h-4 w-4 text-white" />
            </div>
            <span className="text-gradient-gold font-bold tracking-wide">UAE Auto</span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 shadow-glow">
            <Car className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <nav className="relative z-10 flex-1 space-y-0.5 overflow-y-auto p-2 scrollbar-thin">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "sidebar-link group",
                isActive && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-gold-500" : "text-muted-foreground"
              )} />
              {!collapsed && (
                <span className={cn(
                  "transition-all duration-300",
                  isActive ? "font-semibold text-gold-600" : ""
                )}>
                  {item.name}
                </span>
              )}
              {isActive && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-500 shadow-sm shadow-gold-500/50" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="relative z-10 border-t border-gold-200/30 p-4">
        {!collapsed && (
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-gold-500/10 via-gold-500/5 to-transparent p-3 ring-1 ring-gold-500/20 animate-fade-in">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-glow">
              <span className="text-sm font-bold text-white">AU</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Admin User</p>
              <p className="text-xs text-gold-600/80">CEO</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border border-gold-200/30 text-muted-foreground transition-all duration-300 hover:border-gold-400/50 hover:bg-gold-50 hover:text-gold-600",
            !collapsed && "ml-auto",
            collapsed && "mx-auto"
          )}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-500",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>
    </div>
  );
}
