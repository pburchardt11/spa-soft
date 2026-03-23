"use client";

import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "Today's Bookings",
    value: "12",
    change: "+3 vs yesterday",
    icon: Calendar,
    color: "bg-violet-100 text-violet-600",
  },
  {
    label: "Revenue (MTD)",
    value: "$14,280",
    change: "+18% vs last month",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Active Clients",
    value: "348",
    change: "+12 this week",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Avg. Session Length",
    value: "72 min",
    change: "+5 min vs avg",
    icon: Clock,
    color: "bg-amber-100 text-amber-600",
  },
];

const upcomingBookings = [
  {
    time: "9:00 AM",
    client: "Sarah Johnson",
    service: "Deep Tissue Massage",
    therapist: "Emma W.",
    status: "confirmed",
  },
  {
    time: "10:30 AM",
    client: "Michael Chen",
    service: "Hot Stone Therapy",
    therapist: "Olivia K.",
    status: "confirmed",
  },
  {
    time: "11:00 AM",
    client: "Jessica Davis",
    service: "Facial Treatment",
    therapist: "Sophie L.",
    status: "pending",
  },
  {
    time: "1:00 PM",
    client: "Robert Miller",
    service: "Swedish Massage",
    therapist: "Emma W.",
    status: "confirmed",
  },
  {
    time: "2:30 PM",
    client: "Emily Wilson",
    service: "Aromatherapy",
    therapist: "Olivia K.",
    status: "confirmed",
  },
  {
    time: "3:00 PM",
    client: "David Brown",
    service: "Couples Massage",
    therapist: "Sophie L.",
    status: "pending",
  },
];

const recentActivity = [
  { text: "Sarah Johnson booked Deep Tissue Massage", time: "2 min ago" },
  { text: "Payment of $120 received from Michael Chen", time: "15 min ago" },
  { text: "Emily Wilson cancelled her 4:00 PM appointment", time: "1 hr ago" },
  { text: "New client Robert Miller registered", time: "2 hrs ago" },
  { text: "Staff schedule updated for next week", time: "3 hrs ago" },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold">Today&apos;s Schedule</h2>
            <span className="text-xs text-gray-500">
              {upcomingBookings.length} appointments
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingBookings.map((b, i) => (
              <div
                key={i}
                className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-mono text-gray-500 w-16">
                  {b.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.client}</p>
                  <p className="text-xs text-gray-500">
                    {b.service} &middot; {b.therapist}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3.5">
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-gray-400 mt-1">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Completion Rate", value: "94%" },
          { label: "No-show Rate", value: "3%" },
          { label: "Avg. Revenue/Client", value: "$87" },
          { label: "Client Satisfaction", value: "4.9/5" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center"
          >
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
