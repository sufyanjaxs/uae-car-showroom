import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const useMock = typeof window !== "undefined" && !window.location.hostname.includes("localhost");

/* ---------- Mock data ---------- */

const mockVehicles = Array.from({ length: 32 }, (_, i) => ({
  id: `VEH-${String(i + 1).padStart(3, "0")}`,
  vin: `MOCKVIN${String(i + 1).padStart(20, "0")}`,
  brand_name: ["Lamborghini", "Ferrari", "Rolls Royce", "Bentley", "Mercedes-Benz", "BMW", "Porsche", "Audi"][i % 8],
  model_name: ["Urus", "SF90 Stradale", "Ghost", "Continental GT", "G-Wagon", "X7", "Cayenne", "RS7"][i % 8],
  year: 2025 + (i % 2),
  status: ["in_stock", "reserved", "sold"][i % 3],
  condition: "New",
  sale_price: 500000 + i * 50000,
  color: ["Black", "White", "Silver", "Blue", "Red"][i % 5],
  mileage: 0,
}));

const mockCustomers = Array.from({ length: 22 }, (_, i) => ({
  id: `CUST-${String(i + 1).padStart(3, "0")}`,
  first_name: ["Ahmed", "Fatima", "Mohammed", "Noora", "Saeed", "Aisha", "Khalid", "Mariam", "Abdullah", "Hessa", "Rashid", "Latifa", "Hamdan", "Shamma", "Faisal", "Nada", "Sultan", "Amna", "Majid", "Salama", "Thani", "Moza"][i],
  last_name: ["Al Maktoum", "Al Nahyan", "Al Qasimi", "Al Suwaidi", "Al Nuaimi", "Al Shamsi", "Al Mazroui", "Al Hashimi", "Al Balushi", "Al Kindi", "Al Darmaki", "Al Kaabi", "Al Marri", "Al Falasi", "Al Tayer", "Al Ghurair", "Al Futtaim", "Al Owais", "Al Ansari", "Al Qutami", "Al Zaabi", "Al Remeithi"][i],
  email: `customer${i + 1}@example.ae`,
  phone: `+971 50 ${String(1000000 + i * 100000).slice(1)}`,
  emirate: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah"][i % 6],
  customer_type: i % 3 === 0 ? "VIP" : "Regular",
  status: i % 5 === 0 ? "inactive" : "active",
  total_vehicles_purchased: 1 + (i % 5),
  created_at: new Date(2025, i % 12, i + 1).toISOString(),
}));

const mockLeads = Array.from({ length: 18 }, (_, i) => ({
  id: `L-${String(i + 1).padStart(3, "0")}`,
  customer_name: `Lead Customer ${i + 1}`,
  source: ["Website", "Referral", "Instagram", "Showroom", "Phone", "Email"][i % 6],
  status: ["new", "contacted", "negotiation", "closed_won"][i % 4],
  priority: ["High", "Medium", "Low"][i % 3],
  lead_value: 400000 + i * 100000,
  created_at: new Date(2026, 5, i + 1).toISOString(),
}));

/* ---------- Mock response router ---------- */

function mockResponse(config: any) {
  const url: string = config.url || "";
  const method: string = (config.method || "get").toLowerCase();

  // Auth
  if (url === "/auth/login" && method === "post") {
    return { access_token: "mock-access-token", refresh_token: "mock-refresh-token", user: { id: 1, email: "admin@uaeautoshowroom.com", role: "admin" } };
  }
  if (url === "/auth/register" && method === "post") {
    return { id: 99, email: JSON.parse(config.data || "{}").email, role: "user" };
  }
  if (url === "/auth/refresh" && method === "post") {
    return { access_token: "mock-refreshed-token" };
  }

  // Dashboard
  if (url === "/dashboard/ceo") {
    return {
      total_revenue: 28500000,
      total_vehicles: 32,
      total_customers: 156,
      total_leads: 45,
      conversion_rate: 24.8,
      total_inventory_value: 35000000,
      monthly_target: 78,
      service_revenue: 3200000,
    };
  }
  if (url === "/dashboard/sales") {
    return { totalLeads: 18, wonDeals: 4, conversionRate: 22.2, totalRevenue: 6450000 };
  }
  if (url === "/dashboard/inventory") {
    return { totalVehicles: 32, inStock: 20, reserved: 6, sold: 6, totalValue: 35000000 };
  }
  if (url === "/dashboard/finance") {
    return { totalRevenue: 28500000, expenses: 12500000, netProfit: 16000000, pendingInvoices: 8 };
  }

  // Inventory
  if (url.startsWith("/inventory/brands")) return ["Lamborghini", "Ferrari", "Rolls Royce", "Bentley", "Mercedes-Benz", "BMW", "Porsche", "Audi", "Range Rover", "Lexus", "Aston Martin", "McLaren", "Maserati", "Lotus"];
  if (url.startsWith("/inventory/models")) return ["Urus", "Huracan", "SF90", "Ghost", "Cullinan", "Continental GT", "Bentayga", "G-Wagon", "S-Class", "X7", "Cayenne", "911 Turbo S", "RS7", "R8", "DBX", "Artura"];
  if (url.startsWith("/inventory/colors")) return ["Black", "White", "Silver", "Blue", "Red", "Grey", "Green", "Yellow"];

  if (url.startsWith("/inventory") && method === "get") {
    const id = url.replace("/inventory/", "");
    if (id && id !== "inventory" && !id.includes("?")) {
      const v = mockVehicles.find((v) => v.id === id);
      return v || mockVehicles[0];
    }
    return { items: mockVehicles, total: mockVehicles.length };
  }
  if (url.startsWith("/inventory") && method === "post") return { ...JSON.parse(config.data || "{}"), id: "VEH-NEW" };
  if (url.startsWith("/inventory") && (method === "put" || method === "patch")) return JSON.parse(config.data || "{}");
  if (url.startsWith("/inventory") && method === "delete") return { success: true };

  // CRM
  if (url.startsWith("/crm/customers") && method === "get") {
    const id = url.replace("/crm/customers", "").replace("/", "").split("?")[0];
    if (id) {
      const c = mockCustomers.find((c) => c.id === `CUST-${id}`);
      return c || mockCustomers[0];
    }
    return { items: mockCustomers, total: mockCustomers.length };
  }
  if (url.startsWith("/crm/customers") && method === "post") return { ...JSON.parse(config.data || "{}"), id: "CUST-NEW" };
  if (url.startsWith("/crm/customers") && (method === "put" || method === "patch")) return JSON.parse(config.data || "{}");
  if (url.startsWith("/crm/interactions") && method === "post") return { id: "INT-NEW", ...JSON.parse(config.data || "{}") };

  // Sales
  if (url.startsWith("/sales/leads") && method === "get") {
    const id = url.replace("/sales/leads", "").replace("/", "").split("?")[0];
    if (id) {
      const l = mockLeads.find((l) => l.id === `L-${id}`);
      return l || mockLeads[0];
    }
    return mockLeads;
  }
  if (url.startsWith("/sales/leads") && method === "post") return { ...JSON.parse(config.data || "{}"), id: "L-NEW" };
  if (url.startsWith("/sales/leads") && (method === "put" || method === "patch")) return JSON.parse(config.data || "{}");
  if (url.startsWith("/sales/contracts") && method === "get") return [{ id: "CTR-001", customer: "Ahmed Al Maktoum", vehicle: "Lamborghini Urus", amount: 1200000, status: "completed" }];
  if (url.startsWith("/sales/contracts") && method === "post") return { id: "CTR-NEW", ...JSON.parse(config.data || "{}") };
  if (url.startsWith("/sales/quotations") && method === "post") return { id: "QTN-NEW", ...JSON.parse(config.data || "{}") };
  if (url.startsWith("/sales/test-drives") && method === "post") return { id: "TD-NEW", ...JSON.parse(config.data || "{}") };

  // Finance
  if (url.startsWith("/finance/invoices") && method === "get") return [{ id: "INV-001", customer: "Ahmed Al Maktoum", amount: 1200000, status: "paid", due_date: "2026-07-01" }];
  if (url.startsWith("/finance/invoices") && method === "post") return { id: "INV-NEW", ...JSON.parse(config.data || "{}") };
  if (url.startsWith("/finance/payments") && method === "post") return { id: "PAY-NEW", ...JSON.parse(config.data || "{}"), status: "completed" };
  if (url.startsWith("/finance/loan-applications") && method === "post") return { id: "LOAN-NEW", ...JSON.parse(config.data || "{}"), status: "pending" };

  // Reports
  if (url === "/reports/sales-summary") return { total_sales: 28500000, vehicles_sold: 156, avg_price: 182692 };
  if (url === "/reports/inventory-summary") return { total_vehicles: 32, total_value: 35000000, avg_days_in_stock: 45 };
  if (url === "/reports/customer-summary") return { total_customers: 156, active: 132, vip: 18, new_this_month: 12 };
  if (url === "/reports/finance-summary") return { revenue: 28500000, expenses: 12500000, profit: 16000000 };
  if (url === "/reports/performance") return { monthly_target: 78, achieved: 62, yoy_growth: 12.5 };

  return null;
}

/* ---------- Mock adapter ---------- */

if (useMock) {
  (api as any).defaults.adapter = async (config: any) => {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    const data = mockResponse(config);
    if (data !== null && data !== undefined) {
      return { data, status: 200, statusText: "OK", headers: {} as Record<string, string>, config };
    }
    throw new Error("No mock response handler for: " + config.url);
  };
}

/* ---------- Interceptors ---------- */

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token && !useMock) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !useMock) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
          localStorage.setItem("access_token", res.data.access_token);
          error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(error.config);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* ---------- API wrappers ---------- */

export const auth = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
  refresh: (refreshToken: string) => api.post("/auth/refresh", { refresh_token: refreshToken }),
};

export const inventory = {
  list: (params?: any) => api.get("/inventory", { params }),
  get: (id: string) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post("/inventory", data),
  update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`),
  brands: () => api.get("/inventory/brands"),
  models: (params?: any) => api.get("/inventory/models", { params }),
  colors: () => api.get("/inventory/colors"),
};

export const crm = {
  customers: {
    list: (params?: any) => api.get("/crm/customers", { params }),
    get: (id: string) => api.get(`/crm/customers/${id}`),
    create: (data: any) => api.post("/crm/customers", data),
    update: (id: string, data: any) => api.put(`/crm/customers/${id}`, data),
  },
  interactions: {
    create: (data: any) => api.post("/crm/interactions", data),
  },
};

export const sales = {
  leads: {
    list: (params?: any) => api.get("/sales/leads", { params }),
    get: (id: string) => api.get(`/sales/leads/${id}`),
    create: (data: any) => api.post("/sales/leads", data),
    update: (id: string, data: any) => api.put(`/sales/leads/${id}`, data),
  },
  contracts: {
    list: (params?: any) => api.get("/sales/contracts", { params }),
    create: (data: any) => api.post("/sales/contracts", data),
  },
  quotations: {
    create: (data: any) => api.post("/sales/quotations", data),
  },
  testDrives: {
    create: (data: any) => api.post("/sales/test-drives", data),
  },
};

export const finance = {
  invoices: {
    list: (params?: any) => api.get("/finance/invoices", { params }),
    create: (data: any) => api.post("/finance/invoices", data),
  },
  payments: {
    create: (data: any) => api.post("/finance/payments", data),
  },
  loanApplications: {
    create: (data: any) => api.post("/finance/loan-applications", data),
  },
};

export const reports = {
  sales: () => api.get("/reports/sales-summary"),
  inventory: () => api.get("/reports/inventory-summary"),
  customers: () => api.get("/reports/customer-summary"),
  finance: () => api.get("/reports/finance-summary"),
  performance: () => api.get("/reports/performance"),
};

export const dashboard = {
  ceo: () => api.get("/dashboard/ceo"),
  sales: () => api.get("/dashboard/sales"),
  inventory: () => api.get("/dashboard/inventory"),
  finance: () => api.get("/dashboard/finance"),
};
