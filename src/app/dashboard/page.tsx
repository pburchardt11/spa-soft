import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  // Fetch today's bookings with relations
  const { data: todayBookings } = await supabase
    .from("bookings")
    .select("*, client:clients(name), staff:staff(name), service:services(name)")
    .gte("start_time", `${today}T00:00:00`)
    .lt("start_time", `${today}T23:59:59`)
    .order("start_time");

  // Stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: monthBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .gte("start_time", startOfMonth);

  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "completed")
    .gte("created_at", startOfMonth);

  const revenue = (monthPayments || []).reduce((s, p) => s + Number(p.amount), 0);

  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const stats = [
    {
      label: "Today's Bookings",
      value: String(todayBookings?.length || 0),
      change: `${monthBookings || 0} this month`,
      icon: Calendar,
      color: "bg-violet-100 text-violet-600",
    },
    {
      label: "Revenue (MTD)",
      value: `$${revenue.toLocaleString()}`,
      change: "This month",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Active Clients",
      value: String(totalClients || 0),
      change: "Total registered",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Avg. Session",
      value: "72 min",
      change: "Across all services",
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-green-600 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold">Today&apos;s Schedule</h2>
          <span className="text-xs text-gray-500">
            {todayBookings?.length || 0} appointments
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {(!todayBookings || todayBookings.length === 0) ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              No bookings scheduled for today.
            </div>
          ) : (
            todayBookings.map((b) => (
              <div
                key={b.id}
                className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-mono text-gray-500 w-20">
                  {new Date(b.start_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {(b.client as { name: string } | null)?.name || "Walk-in"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(b.service as { name: string } | null)?.name || "Service"} &middot;{" "}
                    {(b.staff as { name: string } | null)?.name || "Unassigned"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : b.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
