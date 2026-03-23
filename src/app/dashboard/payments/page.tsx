"use client";

import { useState } from "react";
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Clock,
} from "lucide-react";

type Transaction = {
  id: string;
  client: string;
  service: string;
  amount: string;
  method: string;
  status: "completed" | "pending" | "refunded";
  date: string;
};

const transactions: Transaction[] = [
  { id: "TXN-001", client: "Sarah Johnson", service: "Deep Tissue Massage", amount: "$120.00", method: "Visa •••• 4242", status: "completed", date: "Mar 23, 2026" },
  { id: "TXN-002", client: "Michael Chen", service: "Hot Stone Therapy", amount: "$150.00", method: "Mastercard •••• 8888", status: "completed", date: "Mar 23, 2026" },
  { id: "TXN-003", client: "Emily Wilson", service: "Aromatherapy", amount: "$95.00", method: "Apple Pay", status: "completed", date: "Mar 22, 2026" },
  { id: "TXN-004", client: "Robert Miller", service: "Swedish Massage", amount: "$110.00", method: "Visa •••• 1234", status: "pending", date: "Mar 22, 2026" },
  { id: "TXN-005", client: "Jessica Davis", service: "Facial Treatment", amount: "$85.00", method: "Cash", status: "completed", date: "Mar 21, 2026" },
  { id: "TXN-006", client: "David Brown", service: "Couples Massage", amount: "$220.00", method: "Visa •••• 5678", status: "refunded", date: "Mar 20, 2026" },
  { id: "TXN-007", client: "Anna Lee", service: "Body Wrap", amount: "$130.00", method: "Mastercard •••• 9999", status: "completed", date: "Mar 20, 2026" },
  { id: "TXN-008", client: "James Wilson", service: "Deep Tissue Massage", amount: "$120.00", method: "Apple Pay", status: "completed", date: "Mar 19, 2026" },
  { id: "TXN-009", client: "Lisa Anderson", service: "Swedish Massage", amount: "$110.00", method: "Visa •••• 3333", status: "completed", date: "Mar 19, 2026" },
  { id: "TXN-010", client: "Thomas Garcia", service: "Hot Stone Therapy", amount: "$150.00", method: "Cash", status: "completed", date: "Mar 18, 2026" },
];

const stats = [
  { label: "Revenue (MTD)", value: "$14,280", change: "+18%", icon: DollarSign, color: "bg-green-100 text-green-600" },
  { label: "Transactions", value: "164", change: "+12%", icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
  { label: "Avg. Transaction", value: "$87", change: "+5%", icon: CreditCard, color: "bg-violet-100 text-violet-600" },
  { label: "Outstanding", value: "$340", change: "3 pending", icon: Clock, color: "bg-amber-100 text-amber-600" },
];

export default function PaymentsPage() {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(
    (t) =>
      t.client.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track revenue and transactions
          </p>
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

      {/* Search */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-600">Transaction</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Client</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Service</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Amount</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Method</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{t.id}</td>
                <td className="px-5 py-3.5 font-medium">{t.client}</td>
                <td className="px-5 py-3.5 text-gray-600">{t.service}</td>
                <td className="px-5 py-3.5 font-semibold">{t.amount}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs">{t.method}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    t.status === "completed" ? "bg-green-100 text-green-700" :
                    t.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
