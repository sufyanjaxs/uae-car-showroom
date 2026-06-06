"use client";

import { useState } from "react";
import { Search, Car } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";

interface Vehicle extends Record<string, unknown> {
  id: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  status: string;
  condition: string;
  price: number;
}

const vehicles: Vehicle[] = [
  { id: "VEH-001", vin: "ZPBUA1ZL0SLA00001", brand: "Lamborghini", model: "Urus", year: 2026, color: "Pearl White", status: "in_stock", condition: "New", price: 1200000 },
  { id: "VEH-002", vin: "ZPBUA1ZL0SLA00002", brand: "Lamborghini", model: "Huracan Tecnica", year: 2025, color: "Grigio Telesto", status: "in_stock", condition: "New", price: 1800000 },
  { id: "VEH-003", vin: "ZFF90VNA0SLA00003", brand: "Ferrari", model: "SF90 Stradale", year: 2026, color: "Rosso Corsa", status: "in_stock", condition: "New", price: 1800000 },
  { id: "VEH-004", vin: "ZFF90VNA0SLA00004", brand: "Ferrari", model: "296 GTB", year: 2025, color: "Giallo Modena", status: "reserved", condition: "New", price: 1500000 },
  { id: "VEH-005", vin: "SCA664S53SLA00005", brand: "Rolls Royce", model: "Ghost", year: 2026, color: "Midnight Blue", status: "in_stock", condition: "New", price: 2500000 },
  { id: "VEH-006", vin: "SCA664S53SLA00006", brand: "Rolls Royce", model: "Cullinan", year: 2025, color: "Arctic White", status: "in_stock", condition: "New", price: 2800000 },
  { id: "VEH-007", vin: "SCBBA53Z0SLA00007", brand: "Bentley", model: "Continental GT", year: 2026, color: "Beluga Black", status: "sold", condition: "New", price: 950000 },
  { id: "VEH-008", vin: "SCBBA53Z0SLA00008", brand: "Bentley", model: "Bentayga", year: 2025, color: "Light Sapphire", status: "in_stock", condition: "New", price: 1100000 },
  { id: "VEH-009", vin: "4JGFF8KB0SLA00009", brand: "Mercedes-Maybach", model: "GLS 600", year: 2026, color: "Obsidian Black", status: "reserved", condition: "New", price: 1300000 },
  { id: "VEH-010", vin: "4JGFF8KB0SLA00010", brand: "Mercedes-AMG", model: "G 63", year: 2025, color: "Designo Mystic", status: "in_stock", condition: "New", price: 850000 },
  { id: "VEH-011", vin: "WDXBF8KB0SLA00011", brand: "Mercedes-Benz", model: "S 580", year: 2026, color: "Nautical Blue", status: "in_stock", condition: "New", price: 650000 },
  { id: "VEH-012", vin: "WDXBF8KB0SLA00012", brand: "Mercedes-AMG", model: "GT 63", year: 2025, color: "Selenite Grey", status: "sold", condition: "New", price: 750000 },
  { id: "VEH-013", vin: "5UXCW8KB0SLA00013", brand: "BMW", model: "X7 M60i", year: 2026, color: "Tanzanite Blue", status: "in_stock", condition: "New", price: 550000 },
  { id: "VEH-014", vin: "5UXCW8KB0SLA00014", brand: "BMW", model: "760i", year: 2025, color: "Oxide Grey", status: "reserved", condition: "New", price: 600000 },
  { id: "VEH-015", vin: "5UXCW8KB0SLA00015", brand: "BMW", model: "M8 Competition", year: 2026, color: "Frozen Marina Bay", status: "in_stock", condition: "New", price: 700000 },
  { id: "VEH-016", vin: "WP1AB8KB0SLA00016", brand: "Porsche", model: "Cayenne Turbo GT", year: 2025, color: "Carmine Red", status: "sold", condition: "New", price: 750000 },
  { id: "VEH-017", vin: "WP1AB8KB0SLA00017", brand: "Porsche", model: "Panamera Turbo S", year: 2026, color: "Gentian Blue", status: "in_stock", condition: "New", price: 800000 },
  { id: "VEH-018", vin: "WP1AB8KB0SLA00018", brand: "Porsche", model: "911 Turbo S", year: 2025, color: "GT Silver", status: "reserved", condition: "New", price: 1100000 },
  { id: "VEH-019", vin: "WUAZZZF8XSLA00019", brand: "Audi", model: "RS7 Sportback", year: 2026, color: "Sebring Black", status: "in_stock", condition: "New", price: 600000 },
  { id: "VEH-020", vin: "WUAZZZF8XSLA00020", brand: "Audi", model: "RS6 Avant", year: 2025, color: "Nardo Grey", status: "in_stock", condition: "New", price: 580000 },
  { id: "VEH-021", vin: "WUAZZZF8XSLA00021", brand: "Audi", model: "R8 V10", year: 2026, color: "Vegas Yellow", status: "sold", condition: "New", price: 950000 },
  { id: "VEH-022", vin: "SALGW3KB0SLA00022", brand: "Range Rover", model: "SV Autobiography", year: 2025, color: "Lantau Bronze", status: "in_stock", condition: "New", price: 1000000 },
  { id: "VEH-023", vin: "SALGW3KB0SLA00023", brand: "Range Rover", model: "Sport SVR", year: 2026, color: "Santorini Black", status: "reserved", condition: "New", price: 700000 },
  { id: "VEH-024", vin: "SALGW3KB0SLA00024", brand: "Range Rover", model: "Velar", year: 2025, color: "Fuji White", status: "in_stock", condition: "New", price: 400000 },
  { id: "VEH-025", vin: "JTJGW3KB0SLA00025", brand: "Lexus", model: "LX 600", year: 2026, color: "Manganese Luster", status: "in_stock", condition: "New", price: 550000 },
  { id: "VEH-026", vin: "JTJGW3KB0SLA00026", brand: "Lexus", model: "LC 500", year: 2025, color: "Infrared", status: "sold", condition: "New", price: 600000 },
  { id: "VEH-027", vin: "SCFGM3KB0SLA00027", brand: "Aston Martin", model: "DBX707", year: 2026, color: "Q Satin Xenon Grey", status: "in_stock", condition: "New", price: 1000000 },
  { id: "VEH-028", vin: "SCFGM3KB0SLA00028", brand: "Aston Martin", model: "Vantage", year: 2025, color: "Lime Essence", status: "reserved", condition: "New", price: 850000 },
  { id: "VEH-029", vin: "SBMGM3KB0SLA00029", brand: "McLaren", model: "Artura", year: 2026, color: "Cerulean Blue", status: "in_stock", condition: "New", price: 1400000 },
  { id: "VEH-030", vin: "SBMGM3KB0SLA00030", brand: "McLaren", model: "765LT", year: 2025, color: "Napier Green", status: "sold", condition: "New", price: 2000000 },
  { id: "VEH-031", vin: "ZAMGM3KB0SLA00031", brand: "Maserati", model: "MC20", year: 2026, color: "Blu Infinito", status: "in_stock", condition: "New", price: 1300000 },
  { id: "VEH-032", vin: "SCCGM3KB0SLA00032", brand: "Lotus", model: "Eletre", year: 2025, color: "Solar Yellow", status: "in_stock", condition: "New", price: 700000 },
];

const statusClass = (s: string) =>
  s === "in_stock" ? "bg-green-100 text-green-700" :
  s === "reserved" ? "bg-blue-100 text-blue-700" :
  s === "sold" ? "bg-gray-100 text-gray-700" :
  "bg-amber-100 text-amber-700";

const statusLabel = (s: string) =>
  s === "in_stock" ? "In Stock" :
  s === "reserved" ? "Reserved" :
  s === "sold" ? "Sold" : s;

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const inStock = vehicles.filter((v) => v.status === "in_stock").length;
  const reserved = vehicles.filter((v) => v.status === "reserved").length;
  const sold = vehicles.filter((v) => v.status === "sold").length;

  const filtered = vehicles.filter((v) => {
    const matchSearch =
      v.vin.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || v.status === filter;
    return matchSearch && matchFilter;
  });

  const filters = ["all", "in_stock", "reserved", "sold"];

  return (
    <div className="space-y-6">
      <div className="animate-slideUp">
        <PageHeader title="Vehicle Inventory" subtitle="Manage your luxury vehicle inventory" gradient />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slideUp" style={{ animationDelay: "0.1s" }}>
        <StatCard title="Total Vehicles" value={vehicles.length.toString()} icon={<Car className="h-5 w-5" />} />
        <StatCard title="In Stock" value={inStock.toString()} icon={<Car className="h-5 w-5" />} trend="Available" />
        <StatCard title="Reserved" value={reserved.toString()} icon={<Car className="h-5 w-5" />} trend="Pending delivery" />
        <StatCard title="Sold" value={sold.toString()} icon={<Car className="h-5 w-5" />} trend="This month" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slideUp" style={{ animationDelay: "0.2s" }}>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by VIN, brand, or model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gold-200/40 bg-gold-50/20 py-2.5 pl-10 pr-4 text-sm backdrop-blur-sm placeholder:text-muted-foreground/60 focus:border-gold-400/60 focus:outline-none focus:ring-2 focus:ring-gold-500/20 transition-all duration-300"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-gold-500 text-white shadow-sm"
                  : "bg-gold-50/50 text-muted-foreground hover:bg-gold-100/50 border border-gold-200/30"
              }`}
            >
              {f === "all" ? "All" : statusLabel(f)}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-slideUp" style={{ animationDelay: "0.3s" }}>
        <DataTable
          columns={[
            { key: "vin", header: "VIN" },
            {
              key: "brand",
              header: "Brand / Model",
              render: (row) => `${row.brand as string} ${row.model as string}`,
            },
            { key: "year", header: "Year" },
            { key: "color", header: "Color" },
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(row.status as string)}`}>
                  {statusLabel(row.status as string)}
                </span>
              ),
            },
            { key: "condition", header: "Condition" },
            {
              key: "price",
              header: "Price",
              className: "text-right",
              render: (row) => formatCurrency(row.price as number),
            },
            {
              key: "id",
              header: "Actions",
              render: (row) => (
                <span className="cursor-pointer text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors">
                  View
                </span>
              ),
            },
          ]}
          data={filtered}
          searchable={false}
          pageSize={10}
        />
      </div>
    </div>
  );
}
