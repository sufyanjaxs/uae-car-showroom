"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp, Users, Target, DollarSign } from "lucide-react";
import { sales, dashboard } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, getStatusColor, formatDate } from "@/lib/utils";
import Link from "next/link";

interface Lead {
  id: string;
  customer_name?: string;
  source: string;
  status: string;
  priority: string;
  lead_value: number;
  created_at: string;
}

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLeads: 0, wonDeals: 0, conversionRate: 0, totalRevenue: 0 });

  useEffect(() => {
    Promise.all([
      sales.leads.list({ page_size: 20 }),
      dashboard.sales(),
    ]).then(([leadsRes, statsRes]) => {
      setLeads(leadsRes.data || []);
      setStats(statsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track leads, opportunities, and deals</p>
        </div>
        <Link
          href="/sales/add-lead"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Leads" value={stats.totalLeads.toString()} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Won Deals" value={stats.wonDeals.toString()} icon={<Target className="h-4 w-4" />} />
        <StatCard title="Conversion Rate" value={`${stats.conversionRate || 0}%`} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard title="Revenue" value={formatCurrency(stats.totalRevenue || 0)} icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{lead.customer_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm capitalize">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">{lead.priority}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatCurrency(lead.lead_value || 0)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
