"use client";

import { useState } from "react";
import { Search, Mail, Phone, MapPin, UserCheck, Users, Star, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emirate: string;
  status: string;
  type: string;
  vehicles: number;
}

const customers: Customer[] = [
  { id: "CUST-001", firstName: "Ahmed", lastName: "Al Maktoum", email: "ahmed.almaktoum@example.ae", phone: "+971 50 123 4567", emirate: "Dubai", status: "active", type: "VIP", vehicles: 5 },
  { id: "CUST-002", firstName: "Fatima", lastName: "Al Nahyan", email: "fatima.alnahyan@example.ae", phone: "+971 50 234 5678", emirate: "Abu Dhabi", status: "active", type: "VIP", vehicles: 3 },
  { id: "CUST-003", firstName: "Mohammed", lastName: "Al Qasimi", email: "mohammed.alqasimi@example.ae", phone: "+971 55 345 6789", emirate: "Sharjah", status: "active", type: "Regular", vehicles: 2 },
  { id: "CUST-004", firstName: "Noora", lastName: "Al Suwaidi", email: "noora.alsuwaidi@example.ae", phone: "+971 50 456 7890", emirate: "Abu Dhabi", status: "active", type: "VIP", vehicles: 4 },
  { id: "CUST-005", firstName: "Saeed", lastName: "Al Nuaimi", email: "saeed.alnuaimi@example.ae", phone: "+971 56 567 8901", emirate: "Ajman", status: "active", type: "Regular", vehicles: 1 },
  { id: "CUST-006", firstName: "Aisha", lastName: "Al Shamsi", email: "aisha.alshamsi@example.ae", phone: "+971 50 678 9012", emirate: "Dubai", status: "active", type: "Regular", vehicles: 2 },
  { id: "CUST-007", firstName: "Khalid", lastName: "Al Mazroui", email: "khalid.almazroui@example.ae", phone: "+971 55 789 0123", emirate: "Abu Dhabi", status: "active", type: "VIP", vehicles: 6 },
  { id: "CUST-008", firstName: "Mariam", lastName: "Al Hashimi", email: "mariam.alhashimi@example.ae", phone: "+971 50 890 1234", emirate: "Dubai", status: "active", type: "Regular", vehicles: 1 },
  { id: "CUST-009", firstName: "Abdullah", lastName: "Al Balushi", email: "abdullah.albalushi@example.ae", phone: "+971 56 901 2345", emirate: "Fujairah", status: "inactive", type: "Regular", vehicles: 1 },
  { id: "CUST-010", firstName: "Hessa", lastName: "Al Kindi", email: "hessa.alkindi@example.ae", phone: "+971 50 012 3456", emirate: "Ras Al Khaimah", status: "active", type: "Regular", vehicles: 2 },
  { id: "CUST-011", firstName: "Rashid", lastName: "Al Darmaki", email: "rashid.aldarmaki@example.ae", phone: "+971 55 111 2222", emirate: "Abu Dhabi", status: "active", type: "VIP", vehicles: 4 },
  { id: "CUST-012", firstName: "Latifa", lastName: "Al Kaabi", email: "latifa.alkaabi@example.ae", phone: "+971 50 333 4444", emirate: "Dubai", status: "active", type: "Regular", vehicles: 2 },
  { id: "CUST-013", firstName: "Hamdan", lastName: "Al Marri", email: "hamdan.almarri@example.ae", phone: "+971 56 555 6666", emirate: "Sharjah", status: "active", type: "Regular", vehicles: 3 },
  { id: "CUST-014", firstName: "Shamma", lastName: "Al Falasi", email: "shamma.alfalasi@example.ae", phone: "+971 50 777 8888", emirate: "Dubai", status: "active", type: "VIP", vehicles: 3 },
  { id: "CUST-015", firstName: "Faisal", lastName: "Al Tayer", email: "faisal.altayer@example.ae", phone: "+971 55 999 0000", emirate: "Abu Dhabi", status: "active", type: "VIP", vehicles: 5 },
  { id: "CUST-016", firstName: "Nada", lastName: "Al Ghurair", email: "nada.alghurair@example.ae", phone: "+971 50 222 1111", emirate: "Dubai", status: "inactive", type: "Regular", vehicles: 1 },
  { id: "CUST-017", firstName: "Sultan", lastName: "Al Futtaim", email: "sultan.alfuttaim@example.ae", phone: "+971 56 444 3333", emirate: "Dubai", status: "active", type: "VIP", vehicles: 7 },
  { id: "CUST-018", firstName: "Amna", lastName: "Al Owais", email: "amna.alowais@example.ae", phone: "+971 50 666 5555", emirate: "Abu Dhabi", status: "active", type: "Regular", vehicles: 2 },
  { id: "CUST-019", firstName: "Majid", lastName: "Al Ansari", email: "majid.alansari@example.ae", phone: "+971 55 888 7777", emirate: "Sharjah", status: "active", type: "Regular", vehicles: 1 },
  { id: "CUST-020", firstName: "Salama", lastName: "Al Qutami", email: "salama.alqutami@example.ae", phone: "+971 50 000 9999", emirate: "Ras Al Khaimah", status: "inactive", type: "Regular", vehicles: 1 },
  { id: "CUST-021", firstName: "Thani", lastName: "Al Zaabi", email: "thani.alzaabi@example.ae", phone: "+971 56 777 6666", emirate: "Abu Dhabi", status: "active", type: "VIP", vehicles: 4 },
  { id: "CUST-022", firstName: "Moza", lastName: "Al Remeithi", email: "moza.alremeithi@example.ae", phone: "+971 50 444 5555", emirate: "Dubai", status: "active", type: "Regular", vehicles: 2 },
];

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`;
}

function statusBadge(status: string) {
  const cls = status === "active"
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

export default function CrmPage() {
  const [search, setSearch] = useState("");

  const active = customers.filter((c) => c.status === "active").length;
  const vip = customers.filter((c) => c.type === "VIP").length;
  const newThisMonth = 3;

  const filtered = customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.emirate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="animate-slideUp">
        <PageHeader title="Customer Relationship Management" subtitle="Manage your customer relationships and VIP accounts" gradient />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
        <StatCard title="Total Customers" value={customers.length.toString()} icon={<Users className="h-5 w-5" />} trend="+5.2%" />
        <StatCard title="Active" value={active.toString()} icon={<UserCheck className="h-5 w-5" />} trend="+3.8%" />
        <StatCard title="VIP" value={vip.toString()} icon={<Star className="h-5 w-5" />} trend="+12.5%" />
        <StatCard title="New This Month" value={newThisMonth.toString()} icon={<UserPlus className="h-5 w-5" />} trend="" />
      </div>

      <div className="animate-slideUp" style={{ animationDelay: "0.2s" }}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers by name, email, or emirate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gold-200/40 bg-gold-50/20 py-2.5 pl-10 pr-4 text-sm backdrop-blur-sm placeholder:text-muted-foreground/60 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-slideUp" style={{ animationDelay: "0.3s" }}>
        {filtered.map((c) => (
          <div key={c.id} className="card-glow p-5 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-sm font-bold text-white shadow-glow">
                  {getInitials(c.firstName, c.lastName)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{c.firstName} {c.lastName}</h3>
                  {statusBadge(c.status)}
                </div>
              </div>
              <span className={`text-xs font-semibold ${c.type === "VIP" ? "text-gold-500" : "text-muted-foreground"}`}>
                {c.type}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {c.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {c.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {c.emirate}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gold-200/20 pt-3 text-xs text-muted-foreground">
              <span className="font-medium text-gold-600">{c.vehicles} vehicle{c.vehicles !== 1 ? "s" : ""} purchased</span>
              <span className="text-xs">{c.id}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No customers match your search.
          </div>
        )}
      </div>
    </div>
  );
}
