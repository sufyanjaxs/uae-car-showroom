"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Users,
  Bell,
  Landmark,
  Globe,
  Save,
  Shield,
  Palette,
  Clock,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇦🇪" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

const timezones = [
  "Asia/Dubai (GST +04:00)",
  "Asia/Muscat (+04:00)",
  "Asia/Riyadh (+03:00)",
  "Asia/Karachi (+05:00)",
  "Asia/Kolkata (+05:30)",
];

interface ToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}

function ToggleSwitch({ label, description, enabled, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
          enabled ? "bg-gold-500" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-300 ${
            enabled ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Mohammed Al Qassimi",
    email: "mohammed@eliterides.ae",
    phone: "+971 50 567 8901",
    role: "Showroom Manager",
  });
  const [showroom, setShowroom] = useState({
    name: "Elite Rides Luxury Motors",
    address: "Sheikh Zayed Road, Dubai Marina",
    license: "LXM-2024-DUBAI-001",
    currency: "AED",
  });
  const [vatRate, setVatRate] = useState("5");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Dubai (GST +04:00)");
  const [showPassword, setShowPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    leadNotifications: true,
    contractUpdates: true,
    weeklyReport: true,
    marketingPromotions: false,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [users, setUsers] = useState([
    { id: 1, name: "Khalid Al Falasi", email: "khalid@eliterides.ae", role: "Sales", status: "active", lastActive: "2026-06-06" },
    { id: 2, name: "Fatima Al Mansouri", email: "fatima@eliterides.ae", role: "Finance Admin", status: "active", lastActive: "2026-06-06" },
    { id: 3, name: "Ahmed Al Suwaidi", email: "ahmed@eliterides.ae", role: "Service Tech", status: "active", lastActive: "2026-06-05" },
    { id: 4, name: "Noura Al Hashimi", email: "noura@eliterides.ae", role: "Marketing", status: "active", lastActive: "2026-06-06" },
    { id: 5, name: "Sara Al Dhahiri", email: "sara@eliterides.ae", role: "HR", status: "inactive", lastActive: "2026-06-01" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage showroom configuration, users, and preferences"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "Settings" }]}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
            <Save className="h-4 w-4" />
            Save All Changes
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-gold-100 p-2.5">
                <User className="h-5 w-5 text-gold-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Profile Settings</h3>
                <p className="text-xs text-muted-foreground">Update your personal information</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Role</label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full rounded-lg border border-gold-200/40 bg-muted/50 px-3.5 py-2.5 text-sm cursor-not-allowed"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Change Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 pr-10 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-blue-100 p-2.5">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Showroom Configuration</h3>
                <p className="text-xs text-muted-foreground">Business details and branding</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Showroom Name</label>
                <input
                  type="text"
                  value={showroom.name}
                  onChange={(e) => setShowroom({ ...showroom, name: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Address</label>
                <input
                  type="text"
                  value={showroom.address}
                  onChange={(e) => setShowroom({ ...showroom, address: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Trade License #</label>
                <input
                  type="text"
                  value={showroom.license}
                  onChange={(e) => setShowroom({ ...showroom, license: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Base Currency</label>
                <select
                  value={showroom.currency}
                  onChange={(e) => setShowroom({ ...showroom, currency: e.target.value })}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                >
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-purple-100 p-2.5">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-xs text-muted-foreground">Manage system users and permissions</p>
              </div>
            </div>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-lg border border-gold-200/20 p-3 transition-all duration-200 hover:bg-gold-50/40">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${u.status === "active" ? "bg-gold-500" : "bg-muted-foreground"}`}>
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email} &middot; {u.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{u.status}</span>
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-gold-50 hover:text-gold-600 transition-colors">
                      <Shield className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-dashed border-gold-200/40 py-2.5 text-sm font-medium text-gold-600 transition-all duration-300 hover:bg-gold-50">
              + Invite New User
            </button>
          </div>

          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-green-100 p-2.5">
                <Bell className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <p className="text-xs text-muted-foreground">Configure how you receive alerts</p>
              </div>
            </div>
            <div className="divide-y divide-gold-200/20">
              <ToggleSwitch label="Email Alerts" description="Receive notifications via email" enabled={notifications.emailAlerts} onChange={() => toggleNotif("emailAlerts")} />
              <ToggleSwitch label="SMS Alerts" description="Get text message updates" enabled={notifications.smsAlerts} onChange={() => toggleNotif("smsAlerts")} />
              <ToggleSwitch label="New Lead Notifications" description="Alert when a new lead is captured" enabled={notifications.leadNotifications} onChange={() => toggleNotif("leadNotifications")} />
              <ToggleSwitch label="Contract Updates" description="Notify on contract status changes" enabled={notifications.contractUpdates} onChange={() => toggleNotif("contractUpdates")} />
              <ToggleSwitch label="Weekly Report" description="Automated weekly performance summary" enabled={notifications.weeklyReport} onChange={() => toggleNotif("weeklyReport")} />
              <ToggleSwitch label="Marketing Promotions" description="Promotional offers and campaigns" enabled={notifications.marketingPromotions} onChange={() => toggleNotif("marketingPromotions")} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-amber-100 p-2.5">
                <Landmark className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">VAT / Tax Settings</h3>
                <p className="text-xs text-muted-foreground">Tax configuration</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">VAT Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={vatRate}
                    onChange={(e) => setVatRate(e.target.value)}
                    className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 pr-8 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">VAT Registration #</label>
                <input
                  type="text"
                  defaultValue="AE-123456789"
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tax Period</label>
                <select className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300">
                  <option>Quarterly</option>
                  <option>Monthly</option>
                  <option>Annually</option>
                </select>
              </div>
              <ToggleSwitch label="Enable VAT Calculation" description="Auto-calculate VAT on transactions" enabled={true} onChange={() => {}} />
            </div>
          </div>

          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-sky-100 p-2.5">
                <Globe className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Language & Region</h3>
                <p className="text-xs text-muted-foreground">Localization preferences</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Interface Language</label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-300 ${
                        language === lang.code
                          ? "border-gold-500 bg-gold-50 text-gold-700 font-medium"
                          : "border-gold-200/40 bg-white text-muted-foreground hover:bg-gold-50"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date Format</label>
                <select className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Number Format</label>
                <select className="w-full rounded-lg border border-gold-200/40 bg-white px-3.5 py-2.5 text-sm focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300">
                  <option>1,234,567.89</option>
                  <option>1 234 567,89</option>
                  <option>1.234.567,89</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-glow p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-xl bg-rose-100 p-2.5">
                <Palette className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Appearance</h3>
                <p className="text-xs text-muted-foreground">Theme customization</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Theme Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="rounded-lg border border-gold-500 bg-gold-50 px-3 py-3 text-sm font-medium text-gold-700 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full bg-amber-300" />
                      Light
                    </div>
                  </button>
                  <button className="rounded-lg border border-gold-200/40 bg-white px-3 py-3 text-sm text-muted-foreground hover:bg-gold-50 transition-all duration-300">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 rounded-full bg-navy-700" />
                      Dark
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Accent Color</label>
                <div className="flex gap-2">
                  {["#D4A843", "#1E4D8C", "#059669", "#7C3AED", "#DC2626"].map((color) => (
                    <button
                      key={color}
                      className="h-8 w-8 rounded-full border-2 border-transparent transition-all duration-300 hover:scale-110 hover:shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
