"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  color: string;
  commission_rate: number;
  role: string;
};

type Booking = {
  id: string;
  start_time: string;
  staff_id: string | null;
  service_id: string | null;
  services: {
    name: string;
    price: number;
    commission_rate: number | null;
  } | null;
  client: { name: string } | null;
};

export default function CommissionsClient({
  staff,
  bookings,
  from,
  to,
  currency,
}: {
  staff: Staff[];
  bookings: Booking[];
  from: string;
  to: string;
  currency: string;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const symbol = currency === "THB" ? "฿" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  // Compute commission per staff member
  const commissionData = useMemo(() => {
    return staff.map((s) => {
      const staffBookings = bookings.filter((b) => b.staff_id === s.id);
      let totalRevenue = 0;
      let totalCommission = 0;
      const lineItems = staffBookings.map((b) => {
        const price = Number(b.services?.price || 0);
        const rate = b.services?.commission_rate ?? s.commission_rate ?? 0;
        const commission = (price * rate) / 100;
        totalRevenue += price;
        totalCommission += commission;
        return {
          ...b,
          price,
          rate,
          commission,
        };
      });
      return {
        staff: s,
        bookings: lineItems,
        count: staffBookings.length,
        totalRevenue,
        totalCommission,
      };
    });
  }, [staff, bookings]);

  const grandTotal = commissionData.reduce((sum, c) => sum + c.totalCommission, 0);
  const grandRevenue = commissionData.reduce((sum, c) => sum + c.totalRevenue, 0);
  const grandBookings = commissionData.reduce((sum, c) => sum + c.count, 0);

  function setPeriod(periodFrom: string, periodTo: string) {
    router.push(`/dashboard/commissions?from=${periodFrom}&to=${periodTo}`);
  }

  function setPreset(preset: "this_month" | "last_month" | "last_30") {
    const now = new Date();
    let f: Date, t: Date;
    if (preset === "this_month") {
      f = new Date(now.getFullYear(), now.getMonth(), 1);
      t = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (preset === "last_month") {
      f = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      t = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      f = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      t = now;
    }
    setPeriod(f.toISOString().split("T")[0], t.toISOString().split("T")[0]);
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Commissions</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track therapist earnings from completed bookings
        </p>
      </div>

      {/* Date filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">From</label>
            <input
              type="date"
              defaultValue={from}
              onChange={(e) => setPeriod(e.target.value, to)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">To</label>
            <input
              type="date"
              defaultValue={to}
              onChange={(e) => setPeriod(from, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-1.5 ml-auto">
            <button onClick={() => setPreset("this_month")} className="text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">This Month</button>
            <button onClick={() => setPreset("last_month")} className="text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Last Month</button>
            <button onClick={() => setPreset("last_30")} className="text-xs px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Last 30 days</button>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
            <TrendingUp className="h-3.5 w-3.5" />
            Total Revenue
          </div>
          <p className="text-2xl font-bold mt-2">{symbol}{grandRevenue.toFixed(0)}</p>
          <p className="text-xs text-gray-400 mt-1">{grandBookings} completed booking{grandBookings !== 1 && "s"}</p>
        </div>
        <div className="bg-white rounded-xl border border-violet-200 bg-violet-50 p-5">
          <div className="flex items-center gap-2 text-xs text-violet-600 uppercase tracking-wide">
            <DollarSign className="h-3.5 w-3.5" />
            Total Commissions
          </div>
          <p className="text-2xl font-bold text-violet-700 mt-2">{symbol}{grandTotal.toFixed(0)}</p>
          <p className="text-xs text-violet-500 mt-1">
            {grandRevenue > 0 ? `${((grandTotal / grandRevenue) * 100).toFixed(1)}%` : "0%"} of revenue
          </p>
        </div>
      </div>

      {/* Per-staff breakdown */}
      <div className="space-y-3">
        {commissionData.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No staff found.</p>
          </div>
        ) : commissionData.every((c) => c.count === 0) ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No completed bookings in this period.</p>
            <p className="text-xs text-gray-400 mt-2">Mark bookings as completed in the Bookings page to track commissions.</p>
          </div>
        ) : (
          commissionData.map((c) => {
            const isExpanded = expanded === c.staff.id;
            return (
              <div key={c.staff.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : c.staff.id)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                    style={{ backgroundColor: c.staff.color }}
                  >
                    {c.staff.name[0]}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold">{c.staff.name}</p>
                    <p className="text-xs text-gray-500">
                      {c.staff.commission_rate}% default · {c.count} booking{c.count !== 1 && "s"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-semibold">{symbol}{c.totalRevenue.toFixed(0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-violet-600 font-medium uppercase">Commission</p>
                    <p className="font-bold text-violet-700">{symbol}{c.totalCommission.toFixed(0)}</p>
                  </div>
                  {c.count > 0 && (
                    isExpanded
                      ? <ChevronDown className="h-4 w-4 text-gray-400" />
                      : <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {isExpanded && c.bookings.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase">
                          <th className="text-left px-4 py-2 font-medium">Date</th>
                          <th className="text-left px-4 py-2 font-medium">Service</th>
                          <th className="text-left px-4 py-2 font-medium">Client</th>
                          <th className="text-right px-4 py-2 font-medium">Price</th>
                          <th className="text-right px-4 py-2 font-medium">Rate</th>
                          <th className="text-right px-4 py-2 font-medium">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.bookings.map((b) => (
                          <tr key={b.id} className="border-t border-gray-200">
                            <td className="px-4 py-2 text-gray-600">
                              {new Date(b.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </td>
                            <td className="px-4 py-2">{b.services?.name || "—"}</td>
                            <td className="px-4 py-2 text-gray-600">{b.client?.name || "—"}</td>
                            <td className="px-4 py-2 text-right">{symbol}{b.price.toFixed(0)}</td>
                            <td className="px-4 py-2 text-right text-gray-500">{b.rate}%</td>
                            <td className="px-4 py-2 text-right font-semibold text-violet-700">{symbol}{b.commission.toFixed(0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
