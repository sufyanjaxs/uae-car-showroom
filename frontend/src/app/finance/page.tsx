"use client";

import { useState } from "react";
import {
  DollarSign,
  CreditCard,
  Landmark,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { AdvancedChart } from "@/components/ui/advanced-chart";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

const revenueData = [
  { month: "Jan", revenue: 4800000, expenses: 1200000, profit: 3600000 },
  { month: "Feb", revenue: 5200000, expenses: 1350000, profit: 3850000 },
  { month: "Mar", revenue: 6100000, expenses: 1400000, profit: 4700000 },
  { month: "Apr", revenue: 5800000, expenses: 1280000, profit: 4520000 },
  { month: "May", revenue: 7200000, expenses: 1500000, profit: 5700000 },
  { month: "Jun", revenue: 6900000, expenses: 1450000, profit: 5450000 },
];

const transactions = [
  { id: "TXN-001", customer: "Abdullah Al Maktoum", vehicle: "Rolls-Royce Phantom", amount: 2850000, type: "Sale", status: "completed", date: "2026-06-05" },
  { id: "TXN-002", customer: "Fatima Al Nahyan", vehicle: "Bentley Continental GT", amount: 1420000, type: "Sale", status: "completed", date: "2026-06-04" },
  { id: "TXN-003", customer: "Khalid Al Qassimi", vehicle: "Lamborghini Urus", amount: 850000, type: "Deposit", status: "pending", date: "2026-06-03" },
  { id: "TXN-004", customer: "Layla Al Hashimi", vehicle: "Mercedes-Maybach S680", amount: 480000, type: "Installment", status: "completed", date: "2026-06-02" },
  { id: "TXN-005", customer: "Omar Al Suwaidi", vehicle: "Ferrari SF90 Stradale", amount: 1950000, type: "Sale", status: "completed", date: "2026-06-01" },
  { id: "TXN-006", customer: "Nora Al Dhahiri", vehicle: "Range Rover SVAutobiography", amount: 620000, type: "Refund", status: "cancelled", date: "2026-05-30" },
  { id: "TXN-007", customer: "Saeed Al Mansouri", vehicle: "Aston Martin DBX707", amount: 780000, type: "Sale", status: "pending", date: "2026-05-29" },
  { id: "TXN-008", customer: "Mariam Al Kaabi", vehicle: "Porsche Cayenne Turbo GT", amount: 520000, type: "Deposit", status: "completed", date: "2026-05-28" },
];

const loanApplications = [
  { id: "LN-001", applicant: "Mohammed Al Falasi", vehicle: "Ferrari Purosangue", amount: 1200000, term: "36 months", status: "approved", apr: "3.9%", date: "2026-06-05" },
  { id: "LN-002", applicant: "Aisha Al Marri", vehicle: "Lamborghini Huracán", amount: 980000, term: "48 months", status: "pending", apr: "4.2%", date: "2026-06-04" },
  { id: "LN-003", applicant: "Hamdan Al Neyadi", vehicle: "Bentley Flying Spur", amount: 850000, term: "36 months", status: "review", apr: "4.0%", date: "2026-06-02" },
  { id: "LN-004", applicant: "Zayed Al Shamsi", vehicle: "Rolls-Royce Cullinan", amount: 2500000, term: "60 months", status: "approved", apr: "3.7%", date: "2026-05-30" },
  { id: "LN-005", applicant: "Hessa Al Muhairi", vehicle: "Aston Martin Vantage", amount: 450000, term: "24 months", status: "rejected", apr: "—", date: "2026-05-28" },
];

const vatData = [
  { quarter: "Q1 2026", collected: 1245000, paid: 890000, net: 355000 },
  { quarter: "Q4 2025", collected: 1150000, paid: 820000, net: 330000 },
  { quarter: "Q3 2025", collected: 1080000, paid: 780000, net: 300000 },
  { quarter: "Q2 2025", collected: 950000, paid: 720000, net: 230000 },
];

export default function FinancePage() {
  const [selectedTab] = useState("overview");

  const stats = [
    { title: "Total Revenue (YTD)", value: formatCurrency(36000000), icon: <DollarSign className="h-4 w-4" />, trend: "+18.5%" },
    { title: "Outstanding Payments", value: formatCurrency(4850000), icon: <CreditCard className="h-4 w-4" />, trend: "-5.2%" },
    { title: "VAT Collected (YTD)", value: formatCurrency(4500000), icon: <Landmark className="h-4 w-4" />, trend: "+12.3%" },
    { title: "Active Loans", value: "24", icon: <PiggyBank className="h-4 w-4" />, trend: "+8.1%" },
  ];

  const transactionColumns = [
    { key: "id", header: "Txn ID" },
    { key: "customer", header: "Customer" },
    { key: "vehicle", header: "Vehicle" },
    {
      key: "amount", header: "Amount",
      render: (row: any) => <span className="font-semibold">{formatCurrency(row.amount)}</span>,
    },
    { key: "type", header: "Type" },
    {
      key: "status", header: "Status",
      render: (row: any) => (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    { key: "date", header: "Date", render: (row: any) => formatDate(row.date) },
  ];

  const loanColumns = [
    { key: "id", header: "Loan ID" },
    { key: "applicant", header: "Applicant" },
    { key: "vehicle", header: "Vehicle" },
    {
      key: "amount", header: "Amount",
      render: (row: any) => <span className="font-semibold">{formatCurrency(row.amount)}</span>,
    },
    { key: "term", header: "Term" },
    { key: "apr", header: "APR" },
    {
      key: "status", header: "Status",
      render: (row: any) => (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance & Accounting"
        subtitle="Revenue, transactions, loans, and VAT management"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "Finance" }]}
        actions={
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
              <FileText className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 animate-slideUp">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 animate-fadeIn">
        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <AdvancedChart
            data={revenueData}
            categories={[
              { key: "revenue", name: "Revenue", color: "#D4A843" },
              { key: "profit", name: "Profit", color: "#1E4D8C" },
            ]}
            index="month"
            type="bar"
            height={280}
          />
        </div>

        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">VAT Summary</h3>
            <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-700">5% Standard</span>
          </div>
          <div className="space-y-4">
            {vatData.map((q, i) => (
              <div key={i} className="animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{q.quarter}</span>
                  <span className="text-sm text-muted-foreground">Net: {formatCurrency(q.net)}</span>
                </div>
                <div className="flex gap-1 h-3">
                  <div className="rounded-l-full bg-gold-400 transition-all duration-500" style={{ width: `${(q.collected / 1300000) * 100}%` }} />
                  <div className="rounded-r-full bg-navy-400 transition-all duration-500" style={{ width: `${(q.paid / 1300000) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                  <span>Collected: {formatCurrency(q.collected)}</span>
                  <span>Paid: {formatCurrency(q.paid)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="flex gap-2">
            {["All", "Sales", "Deposits", "Refunds"].map((tab) => (
              <button
                key={tab}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  selectedTab === tab.toLowerCase()
                    ? "bg-gold-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <DataTable
          columns={transactionColumns}
          data={transactions}
          pageSize={5}
          searchPlaceholder="Search transactions..."
        />
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Loan Applications</h3>
            <p className="text-sm text-muted-foreground">Active and pending loan requests</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{loanApplications.filter(l => l.status === "approved").length} Approved</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">{loanApplications.filter(l => l.status === "pending" || l.status === "review").length} Pending</span>
            </div>
          </div>
        </div>
        <DataTable
          columns={loanColumns}
          data={loanApplications}
          pageSize={5}
          searchPlaceholder="Search loans..."
        />
      </div>
    </div>
  );
}
