import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "AED"): string {
  return `${currency} ${amount.toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatVIN(vin: string): string {
  return vin.toUpperCase();
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_stock: "bg-green-100 text-green-700",
    reserved: "bg-blue-100 text-blue-700",
    sold: "bg-gray-100 text-gray-700",
    in_transit: "bg-amber-100 text-amber-700",
    servicing: "bg-purple-100 text-purple-700",
    active: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}
