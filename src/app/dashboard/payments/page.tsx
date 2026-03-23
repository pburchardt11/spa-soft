import { createClient } from "@/lib/supabase/server";
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
} from "lucide-react";

export default async function PaymentsPage() {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Fetch payments
  const { data: payments } = await supabase
    .from("payments")
    .select("*, client:clients(name), booking:bookings(*, service:services(name))")
    .order("created_at", { ascending: false });

  // Stats
  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount, status")
    .gte("created_at", startOfMonth);

  const completed = (monthPayments || []).filter((p) => p.status === "completed");
  const pending = (monthPayments || []).filter((p) => p.status === "pending");
  const revenue = completed.reduce((s, p) => s + Number(p.amount), 0);
  const outstanding = pending.reduce((s, p) => s + Number(p.amount), 0);
  const avgTransaction = completed.length > 0 ? revenue / completed.length : 0;

  const stats = [
    { label: "Revenue (MTD)", value: `$${revenue.toLocaleString()}`, change: "This month", icon: DollarSign, color: "bg-green-100 text-green-600" },
    { label: "Transactions", value: String(completed.length), change: "Completed", icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
    { label: "Avg. Transaction", value: `$${Math.round(avgTransaction)}`, change: "Per transaction", icon: CreditCard, color: "bg-violet-100 text-violet-600" },
    { label: "Outstanding", value: `$${outstanding.toLocaleString()}`, change: `${pending.length} pending`, icon: Clock, color: "bg-amber-100 text-amber-600" },
  ];

  const methodLabel: Record<string, string> = {
    card: "Card",
    cash: "Cash",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    other: "Other",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Track revenue and transactions</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-green-600 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-600">Client</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Service</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Amount</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Method</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(!payments || payments.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                  No payments yet.
                </td>
              </tr>
            ) : (
              payments.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5 font-medium">
                    {(t.client as { name: string } | null)?.name || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {(t.booking as { service: { name: string } | null } | null)?.service?.name || "-"}
                  </td>
                  <td className="px-5 py-3.5 font-semibold">${Number(t.amount).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">
                    {methodLabel[t.method] || t.method}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      t.status === "completed" ? "bg-green-100 text-green-700" :
                      t.status === "pending" ? "bg-amber-100 text-amber-700" :
                      t.status === "refunded" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(t.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
