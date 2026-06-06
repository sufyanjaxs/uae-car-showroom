"use client";

import { useEffect, useState } from "react";
import { Activity, Car, DollarSign, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { DashboardChart } from "@/components/ui/dashboard-chart";
import { DashboardTable } from "@/components/ui/dashboard-table";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalVehicles: 0,
    totalCustomers: 0,
    totalLeads: 0,
    conversionRate: 0,
    inventoryValue: 0,
  });

  useEffect(() => {
    api.get("/dashboard/ceo").then((res) => {
      if (res.data) {
        setStats({
          totalRevenue: res.data.total_revenue || 0,
          totalVehicles: res.data.total_vehicles || 0,
          totalCustomers: res.data.total_customers || 0,
          totalLeads: res.data.total_leads || 0,
          conversionRate: res.data.conversion_rate || 0,
          inventoryValue: res.data.total_inventory_value || 0,
        });
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to UAE Car Showroom Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`AED ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          icon={<DollarSign className="h-4 w-4" />}
          trend="+12.5%"
        />
        <StatCard
          title="Vehicles in Stock"
          value={stats.totalVehicles.toString()}
          icon={<Car className="h-4 w-4" />}
          trend="+5.2%"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          icon={<Users className="h-4 w-4" />}
          trend="+8.1%"
        />
        <StatCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          icon={<Activity className="h-4 w-4" />}
          trend="+2.3%"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <DashboardChart />
        </div>
        <div className="col-span-3">
          <DashboardTable />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Sales Target</h3>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold">75%</span>
              <span className="text-sm text-muted-foreground">45/60 vehicles</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-full w-3/4 rounded-full bg-primary" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">Aging Inventory</h3>
          </div>
          <p className="mt-4 text-2xl font-bold">12 vehicles</p>
          <p className="text-sm text-muted-foreground">Over 90 days in stock</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Active Leads</h3>
          </div>
          <p className="mt-4 text-2xl font-bold">156</p>
          <p className="text-sm text-muted-foreground">24 new today</p>
        </div>
      </div>
    </div>
  );
}
