"use client";

import { useState } from "react";
import {
  BarChart4,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Download,
  FileText,
  Printer,
  Calendar,
  ChevronDown,
  PieChart,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { AdvancedChart } from "@/components/ui/advanced-chart";
import { formatCurrency } from "@/lib/utils";

const reportTabs = [
  { id: "sales", label: "Sales", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "inventory", label: "Inventory", icon: <Package className="h-4 w-4" /> },
  { id: "customer", label: "Customer", icon: <Users className="h-4 w-4" /> },
  { id: "financial", label: "Financial", icon: <DollarSign className="h-4 w-4" /> },
];

const salesReport = {
  summary: { totalRevenue: 84500000, totalUnits: 124, avgDealSize: 681452, yoyGrowth: 18.5 },
  monthlyData: [
    { month: "Jan", revenue: 12000000, units: 18, target: 11000000 },
    { month: "Feb", revenue: 13500000, units: 20, target: 12000000 },
    { month: "Mar", revenue: 15200000, units: 22, target: 13000000 },
    { month: "Apr", revenue: 14000000, units: 19, target: 14000000 },
    { month: "May", revenue: 16800000, units: 25, target: 14500000 },
    { month: "Jun", revenue: 13000000, units: 20, target: 15000000 },
  ],
  topModels: [
    { model: "Rolls-Royce Phantom", sold: 8, revenue: 22800000, margin: "22%" },
    { model: "Bentley Continental GT", sold: 12, revenue: 17040000, margin: "18%" },
    { model: "Lamborghini Urus", sold: 15, revenue: 12750000, margin: "15%" },
    { model: "Ferrari SF90 Stradale", sold: 6, revenue: 11700000, margin: "20%" },
    { model: "Mercedes-Maybach S680", sold: 10, revenue: 4800000, margin: "14%" },
  ],
};

const inventoryReport = {
  summary: { totalStock: 86, available: 52, reserved: 18, inTransit: 16 },
  brandBreakdown: [
    { brand: "Rolls-Royce", count: 8, value: 28000000, turnover: "45 days" },
    { brand: "Bentley", count: 12, value: 20400000, turnover: "38 days" },
    { brand: "Lamborghini", count: 10, value: 15000000, turnover: "42 days" },
    { brand: "Ferrari", count: 6, value: 12600000, turnover: "35 days" },
    { brand: "Mercedes-Maybach", count: 14, value: 8400000, turnover: "50 days" },
    { brand: "Aston Martin", count: 8, value: 7200000, turnover: "40 days" },
    { brand: "Porsche", count: 18, value: 7200000, turnover: "32 days" },
    { brand: "Range Rover", count: 10, value: 6500000, turnover: "28 days" },
  ],
};

const customerReport = {
  summary: { totalCustomers: 486, newThisYear: 124, repeatRate: "38%", avgSatisfaction: "4.6/5.0" },
  segments: [
    { segment: "HNW Individuals", count: 156, percentage: 32, avgSpend: 3200000 },
    { segment: "Corporate Fleets", count: 89, percentage: 18, avgSpend: 5800000 },
    { segment: "Royal Families", count: 45, percentage: 9, avgSpend: 8500000 },
    { segment: "Expat Professionals", count: 120, percentage: 25, avgSpend: 1200000 },
    { segment: "Car Enthusiasts", count: 76, percentage: 16, avgSpend: 2100000 },
  ],
};

const financialReport = {
  summary: { grossRevenue: 84500000, netProfit: 18590000, expenses: 42150000, taxPaid: 4500000 },
  breakdown: [
    { category: "Cost of Goods Sold", amount: 38000000, percentage: 45 },
    { category: "Staff Salaries", amount: 9600000, percentage: 11.4 },
    { category: "Marketing & Advertising", amount: 5200000, percentage: 6.2 },
    { category: "Showroom Operations", amount: 3800000, percentage: 4.5 },
    { category: "Logistics & Transport", amount: 2500000, percentage: 3 },
    { category: "Technology & IT", amount: 1800000, percentage: 2.1 },
  ],
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState("YTD");

  const renderTabContent = () => {
    switch (activeTab) {
      case "sales":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(salesReport.summary.totalRevenue)}</p>
                <p className="text-xs text-green-600 mt-1">+{salesReport.summary.yoyGrowth}% YoY</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Units Sold</p>
                <p className="text-2xl font-bold mt-1">{salesReport.summary.totalUnits}</p>
                <p className="text-xs text-green-600 mt-1">+12% YoY</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(salesReport.summary.avgDealSize)}</p>
                <p className="text-xs text-green-600 mt-1">+5.2% YoY</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Target Achievement</p>
                <p className="text-2xl font-bold mt-1">{Math.round((84500000 / 79500000) * 100)}%</p>
                <p className="text-xs text-amber-600 mt-1">106% of target</p>
              </div>
            </div>
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue vs Target</h3>
              <AdvancedChart
                data={salesReport.monthlyData}
                categories={[
                  { key: "revenue", name: "Revenue", color: "#D4A843" },
                  { key: "target", name: "Target", color: "#1E4D8C" },
                ]}
                index="month"
                type="bar"
                height={280}
              />
            </div>
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Top Selling Models</h3>
              <DataTable
                columns={[
                  { key: "model", header: "Model" },
                  { key: "sold", header: "Units Sold" },
                  { key: "revenue", header: "Revenue", render: (row: any) => formatCurrency(row.revenue) },
                  { key: "margin", header: "Margin" },
                ]}
                data={salesReport.topModels}
                pageSize={5}
                searchable={false}
              />
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Total Stock</p>
                <p className="text-2xl font-bold mt-1">{inventoryReport.summary.totalStock}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{inventoryReport.summary.available}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Reserved</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">{inventoryReport.summary.reserved}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{inventoryReport.summary.inTransit}</p>
              </div>
            </div>
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory by Brand</h3>
              <DataTable
                columns={[
                  { key: "brand", header: "Brand" },
                  { key: "count", header: "In Stock" },
                  { key: "value", header: "Total Value", render: (row: any) => formatCurrency(row.value) },
                  { key: "turnover", header: "Avg Turnover" },
                ]}
                data={inventoryReport.brandBreakdown}
                pageSize={8}
                searchable={false}
              />
            </div>
          </div>
        );
      case "customer":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold mt-1">{customerReport.summary.totalCustomers}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">New This Year</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{customerReport.summary.newThisYear}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Repeat Rate</p>
                <p className="text-2xl font-bold mt-1">{customerReport.summary.repeatRate}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                <p className="text-2xl font-bold mt-1 text-gold-600">{customerReport.summary.avgSatisfaction}</p>
              </div>
            </div>
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
              <div className="space-y-4">
                {customerReport.segments.map((seg, i) => (
                  <div key={seg.segment} className="animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{seg.segment}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">{seg.count} customers</span>
                        <span className="font-semibold">{formatCurrency(seg.avgSpend)} avg</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-700" style={{ width: `${seg.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "financial":
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Gross Revenue</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(financialReport.summary.grossRevenue)}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(financialReport.summary.netProfit)}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(financialReport.summary.expenses)}</p>
              </div>
              <div className="card-glow p-4">
                <p className="text-sm text-muted-foreground">VAT Paid</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(financialReport.summary.taxPaid)}</p>
              </div>
            </div>
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
              <div className="space-y-4">
                {financialReport.breakdown.map((item, i) => (
                  <div key={item.category} className="animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">{formatCurrency(item.amount)}</span>
                        <span className="font-semibold w-12 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-navy-400 to-navy-600 transition-all duration-700" style={{ width: `${item.percentage * 7}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive business intelligence and performance reports"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "Reports" }]}
        actions={
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-lg border border-gold-200/40 bg-white py-2 pl-3 pr-8 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 appearance-none"
              >
                <option value="QTD">This Quarter</option>
                <option value="YTD">Year to Date</option>
                <option value="1Y">Last 12 Months</option>
                <option value="ALL">All Time</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gold-200/40 bg-white px-4 py-2 text-sm font-medium text-gold-600 hover:bg-gold-50 transition-all duration-300">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gold-200/40 bg-white px-4 py-2 text-sm font-medium text-gold-600 hover:bg-gold-50 transition-all duration-300">
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        }
      />

      <div className="flex gap-2 animate-slideUp">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-gold-500 text-white shadow-md"
                : "bg-card text-muted-foreground border border-gold-200/30 hover:bg-gold-50 hover:text-gold-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}
