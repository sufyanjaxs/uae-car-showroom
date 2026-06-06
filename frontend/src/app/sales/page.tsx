"use client";

import { Users, Target, TrendingUp, DollarSign, Phone, Globe, MessageSquare, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  source: string;
  value: number;
  priority: string;
  daysOpen: number;
}

const sourceIcon: Record<string, React.ReactNode> = {
  Website: <Globe className="h-3.5 w-3.5" />,
  Referral: <User className="h-3.5 w-3.5" />,
  Instagram: <MessageSquare className="h-3.5 w-3.5" />,
  Showroom: <User className="h-3.5 w-3.5" />,
  Phone: <Phone className="h-3.5 w-3.5" />,
  Email: <MessageSquare className="h-3.5 w-3.5" />,
};

const leads: Record<string, Lead[]> = {
  New: [
    { id: "L-001", name: "Omar Al Rashidi", source: "Website", value: 750000, priority: "Medium", daysOpen: 3 },
    { id: "L-002", name: "Laila Al Mansoori", source: "Referral", value: 1200000, priority: "High", daysOpen: 5 },
    { id: "L-003", name: "Hassan Al Nasser", source: "Instagram", value: 550000, priority: "Low", daysOpen: 2 },
    { id: "L-004", name: "Nadia Al Jaber", source: "Showroom", value: 2500000, priority: "High", daysOpen: 1 },
    { id: "L-005", name: "Sami Al Hariri", source: "Phone", value: 850000, priority: "Medium", daysOpen: 4 },
  ],
  Contacted: [
    { id: "L-006", name: "Zayed Al Muhairi", source: "Phone", value: 1100000, priority: "High", daysOpen: 8 },
    { id: "L-007", name: "Huda Al Sharif", source: "Email", value: 650000, priority: "Medium", daysOpen: 10 },
    { id: "L-008", name: "Tariq Al Hassan", source: "Referral", value: 950000, priority: "High", daysOpen: 12 },
    { id: "L-009", name: "Reem Al Shafi", source: "Instagram", value: 400000, priority: "Low", daysOpen: 7 },
    { id: "L-010", name: "Jamal Al Noman", source: "Showroom", value: 3000000, priority: "High", daysOpen: 9 },
  ],
  Negotiation: [
    { id: "L-011", name: "Noura Al Teneiji", source: "Website", value: 1800000, priority: "High", daysOpen: 15 },
    { id: "L-012", name: "Fahad Al Ketbi", source: "Referral", value: 750000, priority: "Medium", daysOpen: 18 },
    { id: "L-013", name: "Dana Al Ajmani", source: "Showroom", value: 2200000, priority: "High", daysOpen: 14 },
    { id: "L-014", name: "Yousif Al Muhanna", source: "Phone", value: 600000, priority: "Low", daysOpen: 20 },
  ],
  "Closed Won": [
    { id: "L-015", name: "Ahmed Al Maktoum", source: "Referral", value: 1200000, priority: "High", daysOpen: 25 },
    { id: "L-016", name: "Fatima Al Nahyan", source: "Showroom", value: 1800000, priority: "High", daysOpen: 30 },
    { id: "L-017", name: "Mohammed Al Qasimi", source: "Website", value: 2500000, priority: "High", daysOpen: 22 },
    { id: "L-018", name: "Noora Al Suwaidi", source: "Referral", value: 950000, priority: "Medium", daysOpen: 28 },
  ],
};

const allLeads = Object.values(leads).flat();
const totalLeads = allLeads.length;
const wonDeals = leads["Closed Won"].length;
const pipelineValue = allLeads.reduce((sum, l) => sum + l.value, 0);
const conversionRate = Math.round((wonDeals / totalLeads) * 100);

const priorityBadge = (p: string) => {
  const cls = p === "High" ? "bg-rose-100 text-rose-700" :
    p === "Medium" ? "bg-amber-100 text-amber-700" :
    "bg-sky-100 text-sky-700";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{p}</span>;
};

const columnBg: Record<string, string> = {
  New: "bg-gradient-to-b from-blue-50/50 to-transparent",
  Contacted: "bg-gradient-to-b from-amber-50/50 to-transparent",
  Negotiation: "bg-gradient-to-b from-purple-50/50 to-transparent",
  "Closed Won": "bg-gradient-to-b from-green-50/50 to-transparent",
};

const columnBorder: Record<string, string> = {
  New: "border-blue-200/40",
  Contacted: "border-amber-200/40",
  Negotiation: "border-purple-200/40",
  "Closed Won": "border-green-200/40",
};

const columnHeader: Record<string, string> = {
  New: "text-blue-700",
  Contacted: "text-amber-700",
  Negotiation: "text-purple-700",
  "Closed Won": "text-green-700",
};

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="animate-slideUp">
        <PageHeader title="Sales Pipeline" subtitle="Track leads, opportunities, and closed deals" gradient />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
        <StatCard title="Total Leads" value={totalLeads.toString()} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Won Deals" value={wonDeals.toString()} icon={<Target className="h-5 w-5" />} trend={`${Math.round((wonDeals / totalLeads) * 100)}% win rate`} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Pipeline Value" value={formatCurrency(pipelineValue)} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slideUp" style={{ animationDelay: "0.2s" }}>
        {Object.entries(leads).map(([stage, stageLeads]) => (
          <div
            key={stage}
            className={`rounded-xl border ${columnBorder[stage]} ${columnBg[stage]} p-4 shadow-soft`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-sm font-bold ${columnHeader[stage]}`}>{stage}</h3>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${columnHeader[stage]} bg-white/80`}>
                {stageLeads.length}
              </span>
            </div>
            <div className="space-y-3">
              {stageLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="group cursor-grab active:cursor-grabbing rounded-xl border border-gold-200/30 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-medium hover:border-gold-400/50 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                    {priorityBadge(lead.priority)}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 rounded-md bg-gold-50/50 px-2 py-0.5">
                      {sourceIcon[lead.source]}
                      {lead.source}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gold-100/50 pt-2">
                    <span className="text-sm font-bold text-gold-600">{formatCurrency(lead.value)}</span>
                    <span className="text-[10px] text-muted-foreground">{lead.daysOpen}d open</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
