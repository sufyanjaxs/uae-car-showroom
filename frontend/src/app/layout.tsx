import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "UAE Auto | Premium Car Showroom Management",
    template: "%s | UAE Auto",
  },
  description:
    "Enterprise-grade automotive dealership management platform for UAE showrooms. Manage inventory, sales, CRM, and finances with luxury precision.",
  keywords: [
    "UAE car showroom",
    "dealership management",
    "automotive ERP",
    "Dubai cars",
    "vehicle inventory",
  ],
  authors: [{ name: "UAE Auto Showroom" }],
  openGraph: {
    title: "UAE Auto | Premium Car Showroom Management",
    description: "Enterprise-grade automotive dealership management platform",
    locale: "en_AE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gold-50/30 via-white to-sand-50/20 p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
