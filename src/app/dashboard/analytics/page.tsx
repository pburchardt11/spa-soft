"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Oct", revenue: 9800 },
  { month: "Nov", revenue: 11200 },
  { month: "Dec", revenue: 13400 },
  { month: "Jan", revenue: 10600 },
  { month: "Feb", revenue: 12100 },
  { month: "Mar", revenue: 14280 },
];

const bookingsData = [
  { day: "Mon", bookings: 18 },
  { day: "Tue", bookings: 22 },
  { day: "Wed", bookings: 15 },
  { day: "Thu", bookings: 24 },
  { day: "Fri", bookings: 28 },
  { day: "Sat", bookings: 32 },
  { day: "Sun", bookings: 12 },
];

const serviceData = [
  { name: "Massage", value: 42, color: "#7c3aed" },
  { name: "Facial", value: 24, color: "#a78bfa" },
  { name: "Body Wrap", value: 15, color: "#c4b5fd" },
  { name: "Aromatherapy", value: 12, color: "#ddd6fe" },
  { name: "Other", value: 7, color: "#ede9fe" },
];

const topServices = [
  { name: "Deep Tissue Massage", bookings: 48, revenue: "$5,760" },
  { name: "Hot Stone Therapy", bookings: 36, revenue: "$5,400" },
  { name: "Swedish Massage", bookings: 32, revenue: "$3,520" },
  { name: "Facial Treatment", bookings: 28, revenue: "$2,380" },
  { name: "Aromatherapy", bookings: 20, revenue: "$1,900" },
];

const therapistPerformance = [
  { name: "Emma W.", clients: 42, satisfaction: 4.9, revenue: "$4,200" },
  { name: "Olivia K.", clients: 38, satisfaction: 4.8, revenue: "$3,800" },
  { name: "Sophie L.", clients: 35, satisfaction: 4.9, revenue: "$3,500" },
  { name: "James R.", clients: 30, satisfaction: 4.7, revenue: "$3,000" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          Business insights and performance metrics
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: "$14,280", sub: "March 2026" },
          { label: "Total Bookings", value: "164", sub: "This month" },
          { label: "New Clients", value: "23", sub: "+15% vs Feb" },
          { label: "Retention Rate", value: "87%", sub: "+3% vs Feb" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-green-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ fill: "#7c3aed" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by day */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">Bookings by Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Service breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">Service Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {serviceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {serviceData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-gray-600">{s.name}</span>
                </div>
                <span className="font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top services */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">Top Services</h2>
          <div className="space-y-3">
            {topServices.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.bookings} bookings</p>
                </div>
                <span className="text-sm font-semibold">{s.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Therapist performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">Staff Performance</h2>
          <div className="space-y-3">
            {therapistPerformance.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.clients} clients &middot; {t.satisfaction} rating
                  </p>
                </div>
                <span className="text-sm font-semibold">{t.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
