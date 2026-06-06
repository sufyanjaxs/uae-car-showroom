"use client";

import { DollarSign, Car, Users, TrendingUp, Target, Wrench, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { AdvancedChart } from "@/components/ui/advanced-chart";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { title: "Total Revenue", value: "AED 28.5M", icon: <DollarSign className="h-5 w-5" />, trend: "+12.5%" },
  { title: "Vehicles in Stock", value: "32", icon: <Car className="h-5 w-5" />, trend: "+5.2%" },
  { title: "Active Customers", value: "156", icon: <Users className="h-5 w-5" />, trend: "+8.1%" },
  { title: "Conversion Rate", value: "24.8%", icon: <TrendingUp className="h-5 w-5" />, trend: "+2.3%" },
  { title: "Monthly Target", value: "78%", icon: <Target className="h-5 w-5" />, trend: "+6.7%" },
  { title: "Service Revenue", value: "AED 3.2M", icon: <Wrench className="h-5 w-5" />, trend: "+15.3%" },
];

const chartData = [
  { month: "Jan", Revenue: 2100000, Expenses: 950000 },
  { month: "Feb", Revenue: 1850000, Expenses: 880000 },
  { month: "Mar", Revenue: 2400000, Expenses: 1020000 },
  { month: "Apr", Revenue: 2200000, Expenses: 980000 },
  { month: "May", Revenue: 2600000, Expenses: 1050000 },
  { month: "Jun", Revenue: 2350000, Expenses: 960000 },
  { month: "Jul", Revenue: 1950000, Expenses: 890000 },
  { month: "Aug", Revenue: 2100000, Expenses: 920000 },
  { month: "Sep", Revenue: 2550000, Expenses: 1080000 },
  { month: "Oct", Revenue: 2700000, Expenses: 1120000 },
  { month: "Nov", Revenue: 2850000, Expenses: 1180000 },
  { month: "Dec", Revenue: 2650000, Expenses: 1100000 },
];

const transactions = [
  { id: "TXN-001", customer: "Ahmed Al Maktoum", vehicle: "Lamborghini Urus", amount: 1200000, status: "completed", date: "Jun 05, 2026" },
  { id: "TXN-002", customer: "Fatima Al Nahyan", vehicle: "Ferrari SF90 Stradale", amount: 1800000, status: "completed", date: "Jun 04, 2026" },
  { id: "TXN-003", customer: "Mohammed Al Qasimi", vehicle: "Rolls Royce Ghost", amount: 2500000, status: "pending", date: "Jun 03, 2026" },
  { id: "TXN-004", customer: "Noora Al Suwaidi", vehicle: "Bentley Continental GT", amount: 950000, status: "completed", date: "Jun 02, 2026" },
  { id: "TXN-005", customer: "Saeed Al Nuaimi", vehicle: "Mercedes G-Wagon", amount: 850000, status: "cancelled", date: "Jun 01, 2026" },
  { id: "TXN-006", customer: "Khalid Al Mazroui", vehicle: "Porsche 911 Turbo S", amount: 1100000, status: "completed", date: "May 30, 2026" },
  { id: "TXN-007", customer: "Mariam Al Hashimi", vehicle: "BMW X7", amount: 550000, status: "pending", date: "May 28, 2026" },
];

const actions = [
  { label: "Add Vehicle", icon: Car, color: "from-gold-400 to-gold-600" },
  { label: "New Customer", icon: Users, color: "from-blue-400 to-blue-600" },
  { label: "Create Invoice", icon: DollarSign, color: "from-green-400 to-green-600" },
  { label: "Sales Report", icon: TrendingUp, color: "from-purple-400 to-purple-600" },
];

const statusClass = (s: string) =>
  s === "completed" ? "bg-green-100 text-green-700" :
  s === "pending" ? "bg-amber-100 text-amber-700" :
  "bg-red-100 text-red-700";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="animate-slideUp">
        <PageHeader title="Dashboard" subtitle="Welcome to UAE Car Showroom Management System" gradient />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slideUp" style={{ animationDelay: "0.1s" }}>
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} trend={s.trend} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5 animate-slideUp" style={{ animationDelay: "0.2s" }}>
        <div className="lg:col-span-3">
          <AdvancedChart
            data={chartData}
            categories={[
              { key: "Revenue", name: "Revenue", color: "#D4A843" },
              { key: "Expenses", name: "Expenses", color: "#1E4D8C" },
            ]}
            index="month"
            type="area"
            height={320}
          />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-gold-200/30 bg-card p-6 shadow-soft">
          <h3 className="mb-4 text-lg font-semibold text-navy-800">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  className="group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300 hover:shadow-glow glass-strong hover:border-gold-400/50"
                >
                  <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${a.color} p-2.5 shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{a.label}</p>
                  <ArrowRight className="mt-1 h-3.5 w-3.5 text-gold-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "customer", header: "Customer" },
            { key: "vehicle", header: "Vehicle" },
            { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount as number) },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(row.status as string)}`}>
                  {row.status as string}
                </span>
              ),
            },
            { key: "date", header: "Date" },
          ]}
          data={transactions}
          pageSize={5}
          searchPlaceholder="Search transactions..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 animate-slideUp" style={{ animationDelay: "0.4s" }}>
        <div className="card-glow p-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gold-500" />
            <h3 className="font-semibold text-navy-800">Sales Target</h3>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-gold-500">78%</span>
              <span className="text-sm text-muted-foreground">25/32 vehicles this month</span>
            </div>
            <div className="mt-3 h-3 rounded-full bg-gold-100">
              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-gold-400 to-gold-600 shadow-sm" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Monthly target: 32 vehicles - 7 remaining</p>
          </div>
        </div>
        <div className="card-glow p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-navy-800">Aging Inventory</h3>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">5</p>
              <p className="text-sm text-muted-foreground">Vehicles over 90 days in stock</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            ⚠ 2 vehicles approaching 120 days - consider price adjustment
          </div>
        </div>
      </div>
    </div>
  );
}
