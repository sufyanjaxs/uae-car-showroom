"use client";

const recentSales = [
  { id: "CTR-000001", customer: "Ahmed Al Maktoum", vehicle: "BMW X5 2024", amount: "AED 345,000", status: "Completed" },
  { id: "CTR-000002", customer: "Sarah Johnson", vehicle: "Mercedes C300", amount: "AED 225,000", status: "Pending" },
  { id: "CTR-000003", customer: "Mohammed Al Falasi", vehicle: "Nissan Patrol", amount: "AED 275,000", status: "Completed" },
  { id: "CTR-000004", customer: "Fatima Al Hashimi", vehicle: "Lexus LX600", amount: "AED 520,000", status: "Completed" },
  { id: "CTR-000005", customer: "Khalid Al Qasimi", vehicle: "Toyota Land Cruiser", amount: "AED 315,000", status: "Pending" },
];

export function DashboardTable() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 font-semibold">Recent Transactions</h3>
      <div className="space-y-4">
        {recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium">{sale.customer}</p>
              <p className="text-xs text-muted-foreground">{sale.vehicle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{sale.amount}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                sale.status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {sale.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
