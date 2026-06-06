import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
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

export const auth = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refresh_token: refreshToken }),
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
