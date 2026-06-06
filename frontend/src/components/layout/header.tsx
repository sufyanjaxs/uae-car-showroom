"use client";

import { Bell, Search, User, Globe } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="flex h-14 items-center border-b bg-card px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles, customers, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-accent">
          <Globe className="h-4 w-4" />
          <span>EN</span>
        </button>
        <button className="relative rounded-lg p-2 hover:bg-accent">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="h-8 w-px bg-border" />
        <button className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
