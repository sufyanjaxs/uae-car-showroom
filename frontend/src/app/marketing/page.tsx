"use client";

import { useState } from "react";
import {
  Megaphone,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  BarChart4,
  PieChart,
  Globe,
  Mail,
  Instagram,
  Twitter,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { AdvancedChart } from "@/components/ui/advanced-chart";
import { formatCurrency } from "@/lib/utils";

const campaignPerformance = [
  { month: "Jan", impressions: 450000, clicks: 22500, leads: 180, conversions: 24 },
  { month: "Feb", impressions: 520000, clicks: 28000, leads: 220, conversions: 31 },
  { month: "Mar", impressions: 610000, clicks: 33500, leads: 265, conversions: 38 },
  { month: "Apr", impressions: 580000, clicks: 29000, leads: 240, conversions: 35 },
  { month: "May", impressions: 720000, clicks: 40000, leads: 310, conversions: 45 },
  { month: "Jun", impressions: 680000, clicks: 37500, leads: 290, conversions: 42 },
];

const campaigns = [
  { id: "CAM-001", name: "Ramadan Luxury Drive", channel: "Social Media", budget: 250000, spent: 240000, leads: 145, conversions: 28, roi: "3.8x", status: "active" },
  { id: "CAM-002", name: "Dubai Expo Showcase", channel: "Event", budget: 500000, spent: 480000, leads: 320, conversions: 52, roi: "4.2x", status: "active" },
  { id: "CAM-003", name: "Summer Elite Campaign", channel: "Email", budget: 120000, spent: 118000, leads: 88, conversions: 15, roi: "2.9x", status: "active" },
  { id: "CAM-004", name: "New Model Launch - Phantom", channel: "TV/Print", budget: 800000, spent: 800000, leads: 410, conversions: 72, roi: "5.1x", status: "completed" },
  { id: "CAM-005", name: "Instagram Brand Story", channel: "Social Media", budget: 180000, spent: 165000, leads: 195, conversions: 22, roi: "3.2x", status: "active" },
  { id: "CAM-006", name: "Abu Dhabi Golf Classic", channel: "Sponsorship", budget: 350000, spent: 350000, leads: 165, conversions: 31, roi: "3.5x", status: "completed" },
  { id: "CAM-007", name: "Luxury Lifestyle Magazine", channel: "Print", budget: 95000, spent: 92000, leads: 55, conversions: 8, roi: "2.1x", status: "draft" },
  { id: "CAM-008", name: "YouTube Test Drive Series", channel: "Video", budget: 220000, spent: 210000, leads: 240, conversions: 36, roi: "4.0x", status: "active" },
];

const leadSources = [
  { source: "Website", leads: 520, percentage: 32, color: "#D4A843" },
  { source: "Instagram", leads: 380, percentage: 23, color: "#E1306C" },
  { source: "Showroom Visit", leads: 290, percentage: 18, color: "#1E4D8C" },
  { source: "Referral", leads: 210, percentage: 13, color: "#059669" },
  { source: "Email", leads: 120, percentage: 7, color: "#2563EB" },
  { source: "Other", leads: 110, percentage: 7, color: "#9CA3AF" },
];

export default function MarketingPage() {
  const [channelFilter, setChannelFilter] = useState("all");

  const stats = [
    { title: "Active Campaigns", value: "5", icon: <Megaphone className="h-4 w-4" />, trend: "+2" },
    { title: "Total Leads Generated", value: "1,630", icon: <Users className="h-4 w-4" />, trend: "+24.5%" },
    { title: "Conversion Rate", value: "14.2%", icon: <Target className="h-4 w-4" />, trend: "+1.8%" },
    { title: "Total ROI", value: "3.6x", icon: <TrendingUp className="h-4 w-4" />, trend: "+0.4x" },
  ];

  const campaignColumns = [
    { key: "id", header: "Campaign ID" },
    { key: "name", header: "Campaign Name" },
    { key: "channel", header: "Channel" },
    {
      key: "budget", header: "Budget",
      render: (row: any) => <span className="font-medium">{formatCurrency(row.budget)}</span>,
    },
    {
      key: "spent", header: "Spent",
      render: (row: any) => <span>{formatCurrency(row.spent)}</span>,
    },
    { key: "leads", header: "Leads" },
    { key: "conversions", header: "Conv." },
    { key: "roi", header: "ROI" },
    {
      key: "status", header: "Status",
      render: (row: any) => {
        const colors: Record<string, string> = { active: "bg-green-100 text-green-700", completed: "bg-blue-100 text-blue-700", draft: "bg-gray-100 text-gray-700" };
        return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[row.status] || ""}`}>{row.status}</span>;
      },
    },
  ];

  const filteredCampaigns = channelFilter === "all" ? campaigns : campaigns.filter(c => c.channel.toLowerCase().replace(/[ /]/g, "") === channelFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing Campaigns"
        subtitle="Track campaign performance, leads, and ROI across all channels"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "Marketing" }]}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
            <Megaphone className="h-4 w-4" />
            New Campaign
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
            <h3 className="text-lg font-semibold">Campaign Performance</h3>
            <span className="text-xs text-muted-foreground">Monthly trends</span>
          </div>
          <AdvancedChart
            data={campaignPerformance}
            categories={[
              { key: "impressions", name: "Impressions", color: "#D4A843" },
              { key: "leads", name: "Leads", color: "#1E4D8C" },
              { key: "conversions", name: "Conversions", color: "#059669" },
            ]}
            index="month"
            type="area"
            height={280}
          />
        </div>

        <div className="card-glow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Lead Sources</h3>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {leadSources.map((source, i) => (
              <div key={source.source} className="animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{source.leads}</span>
                    <span className="text-sm font-semibold">{source.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${source.percentage}%`, backgroundColor: source.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Campaigns</h3>
            <p className="text-sm text-muted-foreground">All marketing campaigns</p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["all", "socialmedia", "email", "event", "tv/print", "sponsorship", "video"].map((ch) => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 capitalize ${
                  channelFilter === ch
                    ? "bg-gold-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {ch === "socialmedia" ? "Social" : ch === "tv/print" ? "TV/Print" : ch}
              </button>
            ))}
          </div>
        </div>
        <DataTable
          columns={campaignColumns}
          data={filteredCampaigns}
          pageSize={5}
          searchPlaceholder="Search campaigns..."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4 animate-slideUp">
        <div className="card-glow p-4 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">32%</p>
            <p className="text-xs text-muted-foreground">Website Traffic</p>
          </div>
        </div>
        <div className="card-glow p-4 flex items-center gap-3">
          <div className="rounded-lg bg-pink-100 p-2.5 text-pink-600">
            <Instagram className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">28%</p>
            <p className="text-xs text-muted-foreground">Instagram Engagement</p>
          </div>
        </div>
        <div className="card-glow p-4 flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2.5 text-sky-600">
            <Twitter className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">15%</p>
            <p className="text-xs text-muted-foreground">Twitter CTR</p>
          </div>
        </div>
        <div className="card-glow p-4 flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold">24%</p>
            <p className="text-xs text-muted-foreground">Email Open Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
