"use client";

import { useState } from "react";
import {
  FileText,
  FileSignature,
  Clock,
  Upload,
  Download,
  Eye,
  FolderOpen,
  FileSpreadsheet,
  FileImage,
  File,
  Search,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { formatDate } from "@/lib/utils";

const documentCategories = [
  { name: "Sales Contracts", count: 48, icon: <FileText className="h-5 w-5" />, color: "text-gold-600 bg-gold-100" },
  { name: "Service Records", count: 156, icon: <FileSpreadsheet className="h-5 w-5" />, color: "text-blue-600 bg-blue-100" },
  { name: "Import Documents", count: 32, icon: <FileImage className="h-5 w-5" />, color: "text-green-600 bg-green-100" },
  { name: "Customer Agreements", count: 89, icon: <FileSignature className="h-5 w-5" />, color: "text-purple-600 bg-purple-100" },
  { name: "Insurance Papers", count: 64, icon: <File className="h-5 w-5" />, color: "text-amber-600 bg-amber-100" },
  { name: "Legal Documents", count: 27, icon: <FileText className="h-5 w-5" />, color: "text-red-600 bg-red-100" },
];

const documents = [
  { id: "DOC-001", name: "Sales Agreement - Phantom V12", type: "Contract", customer: "Sheikh Rashid Al Maktoum", vehicle: "Rolls-Royce Phantom", amount: "AED 2,850,000", status: "signed", date: "2026-06-05" },
  { id: "DOC-002", name: "Service Invoice - Bentley GT", type: "Invoice", customer: "Fatima Al Nahyan", vehicle: "Bentley Continental GT", amount: "AED 18,500", status: "pending", date: "2026-06-04" },
  { id: "DOC-003", name: "Import Clearance - Lamborghini", type: "Customs", customer: "Khalid Al Qassimi", vehicle: "Lamborghini Urus", amount: "—", status: "draft", date: "2026-06-03" },
  { id: "DOC-004", name: "Loan Agreement - Mercedes Maybach", type: "Contract", customer: "Layla Al Hashimi", vehicle: "Mercedes-Maybach S680", amount: "AED 480,000", status: "signed", date: "2026-06-02" },
  { id: "DOC-005", name: "Warranty Certificate - Ferrari", type: "Certificate", customer: "Omar Al Suwaidi", vehicle: "Ferrari SF90 Stradale", amount: "—", status: "signed", date: "2026-06-01" },
  { id: "DOC-006", name: "Insurance Policy - Range Rover", type: "Insurance", customer: "Nora Al Dhahiri", vehicle: "Range Rover SVAutobiography", amount: "AED 12,400", status: "pending", date: "2026-05-30" },
  { id: "DOC-007", name: "Purchase Order - Aston Martin", type: "Contract", customer: "Saeed Al Mansouri", vehicle: "Aston Martin DBX707", amount: "AED 780,000", status: "draft", date: "2026-05-29" },
  { id: "DOC-008", name: "Service History - Porsche Cayenne", type: "Record", customer: "Mariam Al Kaabi", vehicle: "Porsche Cayenne Turbo GT", amount: "—", status: "signed", date: "2026-05-28" },
  { id: "DOC-009", name: "Trade License Renewal", type: "Legal", customer: "Elite Rides LLC", vehicle: "—", amount: "AED 25,000", status: "pending", date: "2026-05-25" },
  { id: "DOC-010", name: "Export Permit - Lamborghini", type: "Customs", customer: "Hamdan Al Maktoum", vehicle: "Lamborghini Aventador", amount: "—", status: "signed", date: "2026-05-22" },
];

const pendingSignatures = [
  { id: "SIG-001", document: "Purchase Order - Aston Martin", signer: "Saeed Al Mansouri", sentDate: "2026-05-29", status: "awaiting" },
  { id: "SIG-002", document: "Service Invoice - Bentley GT", signer: "Fatima Al Nahyan", sentDate: "2026-06-04", status: "awaiting" },
  { id: "SIG-003", document: "Trade License Renewal", signer: "Mohammed Al Qassimi", sentDate: "2026-05-25", status: "overdue" },
  { id: "SIG-004", document: "Insurance Policy - Range Rover", signer: "Nora Al Dhahiri", sentDate: "2026-05-30", status: "awaiting" },
];

export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const stats = [
    { title: "Total Documents", value: documents.length.toString(), icon: <FileText className="h-4 w-4" />, trend: "+8 this month" },
    { title: "Active Contracts", value: "24", icon: <FileSignature className="h-4 w-4" />, trend: "+3" },
    { title: "Pending Signatures", value: pendingSignatures.length.toString(), icon: <Clock className="h-4 w-4" />, trend: "-2" },
    { title: "Categories", value: documentCategories.length.toString(), icon: <FolderOpen className="h-4 w-4" />, trend: "—" },
  ];

  const documentColumns = [
    { key: "id", header: "Doc ID" },
    { key: "name", header: "Name" },
    { key: "type", header: "Type" },
    { key: "customer", header: "Customer/Entity" },
    { key: "vehicle", header: "Vehicle" },
    {
      key: "status", header: "Status",
      render: (row: any) => {
        const c: Record<string, string> = { signed: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700", draft: "bg-gray-100 text-gray-700" };
        return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${c[row.status] || ""}`}>{row.status}</span>;
      },
    },
    {
      key: "date", header: "Date",
      render: (row: any) => formatDate(row.date),
    },
    {
      key: "actions", header: "", sortable: false,
      render: () => (
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-gold-50 hover:text-gold-600 transition-colors"><Eye className="h-3.5 w-3.5" /></button>
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-gold-50 hover:text-gold-600 transition-colors"><Download className="h-3.5 w-3.5" /></button>
          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-gold-50 hover:text-gold-600 transition-colors"><MoreHorizontal className="h-3.5 w-3.5" /></button>
        </div>
      ),
    },
  ];

  const filteredDocs = activeCategory === "all"
    ? documents
    : documents.filter((d) => d.type.toLowerCase() === activeCategory);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents & Contracts"
        subtitle="Manage contracts, agreements, and legal documents"
        gradient
        breadcrumbs={[{ label: "Dashboard" }, { label: "Documents" }]}
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 animate-slideUp">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 animate-fadeIn">
        {documentCategories.map((cat, i) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name.split(" ")[0].toLowerCase())}
            className="card-glow p-4 text-left transition-all duration-300 hover:shadow-md animate-slideUp"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`mb-3 inline-flex rounded-xl p-3 ${cat.color}`}>
              {cat.icon}
            </div>
            <p className="font-semibold">{cat.name}</p>
            <p className="text-sm text-muted-foreground">{cat.count} documents</p>
          </button>
        ))}
      </div>

      <div className="animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent Documents</h3>
            <p className="text-sm text-muted-foreground">Browse and manage your documents</p>
          </div>
          <div className="flex gap-1.5">
            {["all", "contract", "invoice", "insurance", "customs", "legal"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gold-500 text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <DataTable
          columns={documentColumns}
          data={filteredDocs}
          pageSize={5}
          searchPlaceholder="Search documents..."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 animate-slideUp">
        <div className="card-glow p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Signatures</h3>
          <div className="space-y-3">
            {pendingSignatures.map((sig, i) => (
              <div key={sig.id} className="flex items-center justify-between rounded-lg border border-gold-200/20 p-3 transition-all duration-200 hover:bg-gold-50/40 animate-slideUp" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${sig.status === "overdue" ? "bg-red-100" : "bg-amber-100"}`}>
                    <FileSignature className={`h-4 w-4 ${sig.status === "overdue" ? "text-red-600" : "text-amber-600"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{sig.document}</p>
                    <p className="text-xs text-muted-foreground">Awaiting: {sig.signer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${sig.status === "overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {sig.status === "overdue" ? "Overdue" : "Awaiting"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">Sent {formatDate(sig.sentDate)}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-lg border border-dashed border-gold-200/40 py-3 text-sm font-medium text-gold-600 transition-all duration-300 hover:bg-gold-50 inline-flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Send for Signature
          </button>
        </div>

        <div className="card-glow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Upload</h3>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gold-200/40 bg-gold-50/20 p-8 transition-all duration-300 hover:border-gold-400/60 hover:bg-gold-50/40">
            <div className="rounded-full bg-gold-100 p-4 mb-4">
              <Upload className="h-8 w-8 text-gold-600" />
            </div>
            <p className="font-medium text-foreground">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, JPG, PNG (max 25MB)</p>
            <button className="mt-4 rounded-lg bg-gold-500 px-6 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-all duration-300 shadow-soft">
              Browse Files
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Secure upload
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Encrypted storage
            </div>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Digital signatures
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
