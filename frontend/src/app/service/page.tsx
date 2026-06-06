"use client";

import { useState } from "react";
import {
  Wrench,
  CalendarClock,
  CheckCircle2,
  Smile,
  Clock,
  Car,
  Users,
  Star,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { AdvancedChart } from "@/components/ui/advanced-chart";
import { formatCurrency, formatDate } from "@/lib/utils";

const serviceMetrics = [
  { month: "Jan", bookings: 42, completed: 38, revenue: 320 },
  { month: "Feb", bookings: 48, completed: 44, revenue: 365 },
  { month: "Mar", bookings: 55, completed: 51, revenue: 410 },
  { month: "Apr", bookings: 50, completed: 47, revenue: 390 },
  { month: "May", bookings: 62, completed: 58, revenue: 480 },
  { month: "Jun", bookings: 58, completed: 55, revenue: 445 },
];

const upcomingAppointments = [
  { id: "APT-001", customer: "Sheikh Rashid Al Maktoum", vehicle: "Bentley Bentayga", service: "Full Service", time: "09:00 AM", technician: "Ahmed Al Mazroui", status: "confirmed" },
  { id: "APT-002", customer: "Princess Haya Al Khalifa", vehicle: "Rolls-Royce Ghost", service: "Oil Change", time: "10:30 AM", technician: "Khalid Al Suwaidi", status: "confirmed" },
  { id: "APT-003", customer: "Sultan Al Qasimi", vehicle: "Lamborghini Aventador", service: "Brake Replacement", time: "11:00 AM", technician: "Mohammed Al Neyadi", status: "in-progress" },
  { id: "APT-004", customer: "Noura Al Darmaki", vehicle: "Mercedes G-Wagon", service: "AC Service", time: "02:00 PM", technician: "Faisal Al Hashimi", status: "confirmed" },
  { id: "APT-005", customer: "Hamdan Al Maktoum", vehicle: "Ferrari 488 Spider", service: "Annual Service", time: "03:30 PM", technician: "Ahmed Al Mazroui", status: "pending" },
];

const repairOrders = [
  { id: "RPO-001", customer: "Abdullah Al Falasi", vehicle: "Porsche 911 Turbo S", issue: "Engine Misfire", status: "in-progress", priority: "high", labourHours: 6.5, cost: 28500, startDate: "2026-06-03" },
  { id: "RPO-002", customer: "Mariam Al Mansouri", vehicle: "Range Rover Sport", issue: "Transmission Fault", status: "pending", priority: "critical", labourHours: 8, cost: 42000, startDate: "2026-06-05" },
  { id: "RPO-003", customer: "Khalifa Al Nahyan", vehicle: "Bentley Continental GT", issue: "Electrical System", status: "completed", priority: "medium", labourHours: 4, cost: 18500, startDate: "2026-06-01" },
  { id: "RPO-004", customer: "Layla Al Shamsi", vehicle: "Aston Martin DB12", issue: "Suspension Noise", status: "in-progress", priority: "medium", labourHours: 5, cost: 22000, startDate: "2026-06-02" },
  { id: "RPO-005", customer: "Mohammed Al Matar", vehicle: "Lamborghini Urus", issue: "Brake System", status: "completed", priority: "high", labourHours: 7, cost: 32000, startDate: "2026-05-28" },
  { id: "RPO-006", customer: "Fatima Al Kaabi", vehicle: "Mercedes-Maybach GLS600", issue: "Infotainment Glitch", status: "pending", priority: "low", labourHours: 2.5, cost: 9500, startDate: "2026-06-06" },
  { id: "RPO-007", customer: "Ahmed Al Rumaithi", vehicle: "Ferrari Roma", issue: "AC Compressor Failure", status: "in-progress", priority: "high", labourHours: 6, cost: 26000, startDate: "2026-06-04" },
  { id: "RPO-008", customer: "Sara Al Neyadi", vehicle: "Bentley Flying Spur", issue: "Routine Service", status: "completed", priority: "low", labourHours: 3.5, cost: 12000, startDate: "2026-05-26" },
];

const satisfactionData = [
  { month: "Jan", rating: 4.5, surveys: 28 },
  { month: "Feb", rating: 4.6, surveys: 32 },
  { month: "Mar", rating: 4.7, surveys: 35 },
  { month: "Apr", rating: 4.5, surveys: 30 },
  { month: "May", rating: 4.8, surveys: 38 },
  { month: "Jun", rating: 4.6, surveys: 33 },
];

export default function ServicePage() {
  const [statusFilter] = useState("all");

  const stats = [
    { title: "Pending Appointments", value: "12", icon: <CalendarClock className="h-4 w-4" />, trend: "+3" },
    { title: "Active Repairs", value: "8", icon: <Wrench className="h-4 w-4" />, trend: "+1" },
    { title: "Completed Today", value: "6", icon: <CheckCircle2 className="h-4 w-4" />, trend: "+2" },
    { title: "Customer Satisfaction", value: "4.7/5.0", icon: <Smile className="h-4 w-4" />, trend: "+0.2" },
  ];

  const repairColumns = [
    { key: "id", header: "Order ID" },
    { key: "customer", header: "Customer" },
    { key: "vehicle", header: "Vehicle" },
    { key: "issue", header: "Issue" },
    {
      key: "priority", header: "Priority",
      render: (row: any) => {
        const colors: Record<string, string> = { critical: "bg-red-100 text-red-700", high: "bg-amber-100 text-amber-700", medium: "bg-blue-100 text-blue-700", low: "bg-green-100 text-green-700" };
        return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[row.priority] || ""}`}>{row.priority}</span>;
      },
    },
    {
      key: "status", header: "Status",
      render: (row: any) => {
        const colors: Record<string, string> = { "in-progress": "bg-blue-100 text-blue-700", pending: "bg-amber-100 text-amber-700", completed: "bg-green-100 text-green-700" };
        return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[row.status] || ""}`}>{row.status}</span>;
      },
    },
    { key: "labourHours", header: "Hours" },
    {
      key: "cost", header: "Cost",
      render: (row: any) => <span className="font-semibold">{formatCurrency(row.cost)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Center"
        subtitle="Repairs, appointments, and customer satisfaction tracking"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "Service" }]}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
            <CalendarClock className="h-4 w-4" />
            Book Appointment
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
            <h3 className="text-lg font-semibold">Service Performance</h3>
            <span className="text-xs text-muted-foreground">Monthly metrics</span>
          </div>
          <AdvancedChart
            data={serviceMetrics}
            categories={[
              { key: "bookings", name: "Bookings", color: "#D4A843" },
              { key: "completed", name: "Completed", color: "#1E4D8C" },
              { key: "revenue", name: "Revenue (AED 000s)", color: "#FFBE4D" },
            ]}
            index="month"
            type="bar"
            height={260}
          />
        </div>

        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Satisfaction</h3>
            <div className="flex items-center gap-1 text-gold-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">4.6 Avg</span>
            </div>
          </div>
          <AdvancedChart
            data={satisfactionData}
            categories={[{ key: "rating", name: "Rating", color: "#D4A843" }]}
            index="month"
            type="area"
            height={200}
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-700">94%</p>
              <p className="text-xs text-muted-foreground">On-Time</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">98%</p>
              <p className="text-xs text-muted-foreground">Fix Rate</p>
            </div>
            <div className="rounded-lg bg-gold-50 p-3 text-center">
              <p className="text-2xl font-bold text-gold-700">4.7</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            <p className="text-sm text-muted-foreground">Today&apos;s schedule</p>
          </div>
          <button className="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {upcomingAppointments.map((apt, i) => (
            <div key={apt.id} className="card-glow p-4 animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <span className="rounded-lg bg-gold-100 px-2.5 py-1 text-xs font-medium text-gold-700">{apt.time}</span>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  apt.status === "confirmed" ? "bg-green-100 text-green-700" :
                  apt.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                }`}>{apt.status}</span>
              </div>
              <p className="font-semibold">{apt.customer}</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Car className="h-3.5 w-3.5" />
                {apt.vehicle}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Wrench className="h-3.5 w-3.5" />
                {apt.service}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {apt.technician}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Repair Orders</h3>
            <p className="text-sm text-muted-foreground">Active and recent repair jobs</p>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">{repairOrders.filter(r => r.priority === "critical" || r.priority === "high").length} high priority</span>
          </div>
        </div>
        <DataTable
          columns={repairColumns}
          data={repairOrders}
          pageSize={5}
          searchPlaceholder="Search repairs..."
        />
      </div>
    </div>
  );
}
