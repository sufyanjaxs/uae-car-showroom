"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  UserMinus,
  Building2,
  Briefcase,
  Calendar,
  Award,
  Clock,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { AdvancedChart } from "@/components/ui/advanced-chart";
import { formatCurrency } from "@/lib/utils";

const departmentData = [
  { month: "Jan", sales: 18, service: 14, admin: 10, marketing: 8 },
  { month: "Feb", sales: 18, service: 15, admin: 10, marketing: 8 },
  { month: "Mar", sales: 20, service: 15, admin: 11, marketing: 9 },
  { month: "Apr", sales: 20, service: 16, admin: 11, marketing: 9 },
  { month: "May", sales: 22, service: 16, admin: 12, marketing: 10 },
  { month: "Jun", sales: 22, service: 17, admin: 12, marketing: 10 },
];

const employees = [
  { id: "EMP-001", name: "Khalid Al Falasi", department: "Sales", role: "Senior Sales Executive", email: "khalid@eliterides.ae", phone: "+971 50 123 4567", salary: 45000, status: "active", joinDate: "2023-03-15" },
  { id: "EMP-002", name: "Fatima Al Mansouri", department: "Finance", role: "Finance Manager", email: "fatima@eliterides.ae", phone: "+971 50 234 5678", salary: 55000, status: "active", joinDate: "2022-08-01" },
  { id: "EMP-003", name: "Ahmed Al Suwaidi", department: "Service", role: "Master Technician", email: "ahmed@eliterides.ae", phone: "+971 50 345 6789", salary: 38000, status: "active", joinDate: "2021-11-20" },
  { id: "EMP-004", name: "Noura Al Hashimi", department: "Marketing", role: "Marketing Director", email: "noura@eliterides.ae", phone: "+971 50 456 7890", salary: 52000, status: "active", joinDate: "2023-06-10" },
  { id: "EMP-005", name: "Mohammed Al Qassimi", department: "Sales", role: "Showroom Manager", email: "mohammed@eliterides.ae", phone: "+971 50 567 8901", salary: 48000, status: "active", joinDate: "2022-01-05" },
  { id: "EMP-006", name: "Sara Al Dhahiri", department: "HR", role: "HR Coordinator", email: "sara@eliterides.ae", phone: "+971 50 678 9012", salary: 32000, status: "on-leave", joinDate: "2023-09-12" },
  { id: "EMP-007", name: "Omar Al Matar", department: "Service", role: "Service Advisor", email: "omar@eliterides.ae", phone: "+971 50 789 0123", salary: 28000, status: "active", joinDate: "2024-02-18" },
  { id: "EMP-008", name: "Layla Al Neyadi", department: "Admin", role: "Executive Assistant", email: "layla@eliterides.ae", phone: "+971 50 890 1234", salary: 25000, status: "active", joinDate: "2024-04-01" },
  { id: "EMP-009", name: "Hamdan Al Rumaithi", department: "Sales", role: "Sales Consultant", email: "hamdan@eliterides.ae", phone: "+971 50 901 2345", salary: 35000, status: "active", joinDate: "2024-06-15" },
  { id: "EMP-010", name: "Mariam Al Kaabi", department: "Finance", role: "Accountant", email: "mariam@eliterides.ae", phone: "+971 50 012 3456", salary: 30000, status: "on-leave", joinDate: "2023-12-01" },
  { id: "EMP-011", name: "Sultan Al Shamsi", department: "Service", role: "Diagnostic Specialist", email: "sultan@eliterides.ae", phone: "+971 50 111 2222", salary: 36000, status: "active", joinDate: "2023-05-22" },
  { id: "EMP-012", name: "Aisha Al Marri", department: "Marketing", role: "Social Media Coordinator", email: "aisha@eliterides.ae", phone: "+971 50 222 3333", salary: 27000, status: "active", joinDate: "2024-07-08" },
];

const leaveRequests = [
  { id: "LV-001", employee: "Sara Al Dhahiri", department: "HR", type: "Annual Leave", days: 5, from: "2026-06-10", to: "2026-06-14", status: "approved" },
  { id: "LV-002", employee: "Mariam Al Kaabi", department: "Finance", type: "Sick Leave", days: 2, from: "2026-06-08", to: "2026-06-09", status: "approved" },
  { id: "LV-003", employee: "Ahmed Al Suwaidi", department: "Service", type: "Personal Leave", days: 1, from: "2026-06-12", to: "2026-06-12", status: "pending" },
  { id: "LV-004", employee: "Noura Al Hashimi", department: "Marketing", type: "Annual Leave", days: 3, from: "2026-06-15", to: "2026-06-17", status: "pending" },
  { id: "LV-005", employee: "Khalid Al Falasi", department: "Sales", type: "Training", days: 2, from: "2026-06-20", to: "2026-06-21", status: "approved" },
];

const departments = [
  { name: "Sales", count: 8, head: "Mohammed Al Qassimi", budget: 420000, color: "bg-gold-500" },
  { name: "Service", count: 6, head: "Ahmed Al Suwaidi", budget: 320000, color: "bg-blue-500" },
  { name: "Finance", count: 4, head: "Fatima Al Mansouri", budget: 280000, color: "bg-green-500" },
  { name: "Marketing", count: 4, head: "Noura Al Hashimi", budget: 240000, color: "bg-purple-500" },
  { name: "Admin & HR", count: 3, head: "Sara Al Dhahiri", budget: 180000, color: "bg-amber-500" },
];

export default function HRPage() {
  const [deptFilter] = useState("all");

  const stats = [
    { title: "Total Employees", value: employees.length.toString(), icon: <Users className="h-4 w-4" />, trend: "+2 this quarter" },
    { title: "Active Staff", value: employees.filter(e => e.status === "active").length.toString(), icon: <UserCheck className="h-4 w-4" />, trend: "92% of total" },
    { title: "On Leave", value: employees.filter(e => e.status === "on-leave").length.toString(), icon: <UserMinus className="h-4 w-4" />, trend: "-1 from last week" },
    { title: "Departments", value: departments.length.toString(), icon: <Building2 className="h-4 w-4" />, trend: "Stable" },
  ];

  const employeeColumns = [
    { key: "id", header: "Emp ID" },
    { key: "name", header: "Name" },
    { key: "department", header: "Department" },
    { key: "role", header: "Role" },
    { key: "email", header: "Email" },
    {
      key: "salary", header: "Salary",
      render: (row: any) => <span className="font-semibold">{formatCurrency(row.salary)}/mo</span>,
    },
    {
      key: "status", header: "Status",
      render: (row: any) => (
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${row.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
          {row.status === "active" ? "Active" : "On Leave"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Human Resources"
        subtitle="Employee management, departments, and attendance tracking"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "HR" }]}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
            <Users className="h-4 w-4" />
            Add Employee
          </button>
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
            <h3 className="text-lg font-semibold">Department Growth</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <AdvancedChart
            data={departmentData}
            categories={[
              { key: "sales", name: "Sales", color: "#D4A843" },
              { key: "service", name: "Service", color: "#1E4D8C" },
              { key: "admin", name: "Admin", color: "#059669" },
              { key: "marketing", name: "Marketing", color: "#7C3AED" },
            ]}
            index="month"
            type="area"
            height={250}
          />
        </div>

        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Department Overview</h3>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {departments.map((dept, i) => (
              <div key={dept.name} className="animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${dept.color}`} />
                    <span className="text-sm font-medium">{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{dept.count} staff</span>
                    <span className="font-semibold">{formatCurrency(dept.budget)}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${dept.color}`}
                    style={{ width: `${(dept.count / 8) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Head: {dept.head}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Employee Directory</h3>
            <p className="text-sm text-muted-foreground">{employees.filter(e => e.status === "active").length} active employees</p>
          </div>
        </div>
        <DataTable
          columns={employeeColumns}
          data={employees}
          pageSize={6}
          searchPlaceholder="Search employees..."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 animate-slideUp">
        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Leave Requests</h3>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {leaveRequests.map((lr, i) => (
              <div key={lr.id} className="flex items-center justify-between rounded-lg border border-gold-200/20 p-3 transition-all duration-200 hover:bg-gold-50/40 animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${lr.status === "approved" ? "bg-green-100" : "bg-amber-100"}`}>
                    <Clock className={`h-4 w-4 ${lr.status === "approved" ? "text-green-600" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{lr.employee}</p>
                    <p className="text-xs text-muted-foreground">{lr.type} &middot; {lr.days} day{lr.days > 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${lr.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {lr.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{lr.from} - {lr.to}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quick Stats</h3>
            <Award className="h-4 w-4 text-gold-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gold-200/30 bg-gold-50/50 p-4 text-center">
              <p className="text-3xl font-bold text-gold-600">4.2</p>
              <p className="text-xs text-muted-foreground">Avg Tenure (Years)</p>
            </div>
            <div className="rounded-xl border border-blue-200/30 bg-blue-50/50 p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">AED 1.6M</p>
              <p className="text-xs text-muted-foreground">Monthly Payroll</p>
            </div>
            <div className="rounded-xl border border-green-200/30 bg-green-50/50 p-4 text-center">
              <p className="text-3xl font-bold text-green-600">96%</p>
              <p className="text-xs text-muted-foreground">Attendance Rate</p>
            </div>
            <div className="rounded-xl border border-purple-200/30 bg-purple-50/50 p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">12</p>
              <p className="text-xs text-muted-foreground">Open Positions</p>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg border border-gold-200/40 py-2.5 text-sm font-medium text-gold-600 transition-all duration-300 hover:bg-gold-50 inline-flex items-center justify-center gap-1">
            View Payroll Details <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
