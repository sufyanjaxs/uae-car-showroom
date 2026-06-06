"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Mail, Phone, MapPin } from "lucide-react";
import { crm } from "@/lib/api";
import { formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  emirate: string;
  customer_type: string;
  status: string;
  total_vehicles_purchased: number;
  created_at: string;
}

export default function CrmPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const res = await crm.customers.list({ page_size: 50 });
      setCustomers(res.data.items || []);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
          <p className="text-muted-foreground">Customer Relationship Management</p>
        </div>
        <Link
          href="/crm/add"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </Link>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <Link key={c.id} href={`/crm/${c.id}`} className="rounded-xl border bg-card p-6 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{c.first_name} {c.last_name}</h3>
                <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(c.status)}`}>
                  {c.status}
                </span>
              </div>
              <span className="text-xs capitalize text-muted-foreground">{c.customer_type}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {c.email || "No email"}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {c.phone}
              </div>
              {c.emirate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {c.emirate}
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
              <span>{c.total_vehicles_purchased} vehicles</span>
              <span>{formatDate(c.created_at)}</span>
            </div>
          </Link>
        ))}
        {customers.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No customers found. Add your first customer to get started.
          </div>
        )}
      </div>
    </div>
  );
}
