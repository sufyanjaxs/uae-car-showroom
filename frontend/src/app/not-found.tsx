import Link from "next/link";
import { Car, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-glow animate-float">
        <Car className="h-10 w-10 text-white" />
      </div>
      <h1 className="mb-2 text-7xl font-bold text-gradient-gold">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-navy-900">Page Not Found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        This route doesn&apos;t exist in our showroom. Let us drive you back to familiar roads.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gold-500/25 transition-all duration-300 hover:shadow-glow hover:brightness-110"
      >
        <Home className="h-4 w-4" />
        Return to Dashboard
      </Link>
      <div className="mt-12 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-uae-green" />
          UAE Auto Showroom
        </span>
        <span>•</span>
        <span>Premium Dealership Management</span>
      </div>
    </div>
  );
}
