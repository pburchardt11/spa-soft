"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  CreditCard,
  Sparkles,
  ArrowLeft,
  Search,
} from "lucide-react";

type Business = {
  id: string;
  name: string;
  email: string | null;
  plan: string;
  subscription_plan: string;
  subscription_status: string;
  currency: string;
  created_at: string;
  staff_count: number;
  booking_count: number;
  client_count: number;
};

type Stats = {
  total_businesses: number;
  recent_signups: number;
  total_bookings: number;
  total_clients: number;
  active_subscriptions: number;
};

export default function AdminClient({
  businesses,
  stats,
}: {
  businesses: Business[];
  stats: Stats;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          (b.email && b.email.toLowerCase().includes(search.toLowerCase()))
      )
    : businesses;

  const statusColor: Record<string, string> = {
    free: "bg-gray-100 text-gray-700",
    active: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    past_due: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-violet-600" />
            <span className="font-bold text-lg">SpaSoft Admin</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { icon: Building2, label: "Total Businesses", value: stats.total_businesses, color: "text-violet-600 bg-violet-100" },
            { icon: TrendingUp, label: "Last 30 Days", value: stats.recent_signups, color: "text-green-600 bg-green-100" },
            { icon: CreditCard, label: "Paid Subscribers", value: stats.active_subscriptions, color: "text-blue-600 bg-blue-100" },
            { icon: Calendar, label: "Total Bookings", value: stats.total_bookings, color: "text-amber-600 bg-amber-100" },
            { icon: Users, label: "Total Clients", value: stats.total_clients, color: "text-pink-600 bg-pink-100" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Business table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Business</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Email</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Plan</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Staff</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Bookings</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Clients</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      {search ? "No businesses match your search." : "No businesses yet."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm">{b.name}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{b.email || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-medium capitalize bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                          {b.subscription_plan || b.plan || "starter"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${
                          statusColor[b.subscription_status] || statusColor.free
                        }`}>
                          {b.subscription_status || "free"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">{b.staff_count}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">{b.booking_count}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-600">{b.client_count}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(b.created_at).toLocaleDateString("en-US", {
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

        <p className="mt-6 text-xs text-gray-400 text-center">
          Only accessible by admin users. Data refreshes on page load.
        </p>
      </div>
    </div>
  );
}
