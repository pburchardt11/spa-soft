"use client";

import { useState } from "react";
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

const therapists = ["Emma W.", "Olivia K.", "Sophie L.", "James R."];

type Booking = {
  id: number;
  client: string;
  service: string;
  therapist: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  phone: string;
};

const initialBookings: Booking[] = [
  { id: 1, client: "Sarah Johnson", service: "Deep Tissue Massage", therapist: "Emma W.", time: "9:00 AM", duration: 60, status: "confirmed", phone: "(555) 123-4567" },
  { id: 2, client: "Michael Chen", service: "Hot Stone Therapy", therapist: "Olivia K.", time: "10:30 AM", duration: 90, status: "confirmed", phone: "(555) 234-5678" },
  { id: 3, client: "Jessica Davis", service: "Facial Treatment", therapist: "Sophie L.", time: "11:00 AM", duration: 45, status: "pending", phone: "(555) 345-6789" },
  { id: 4, client: "Robert Miller", service: "Swedish Massage", therapist: "Emma W.", time: "1:00 PM", duration: 60, status: "confirmed", phone: "(555) 456-7890" },
  { id: 5, client: "Emily Wilson", service: "Aromatherapy", therapist: "Olivia K.", time: "2:30 PM", duration: 60, status: "confirmed", phone: "(555) 567-8901" },
  { id: 6, client: "David Brown", service: "Couples Massage", therapist: "James R.", time: "3:00 PM", duration: 90, status: "pending", phone: "(555) 678-9012" },
  { id: 7, client: "Anna Lee", service: "Body Wrap", therapist: "Sophie L.", time: "4:00 PM", duration: 75, status: "confirmed", phone: "(555) 789-0123" },
];

export default function BookingsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [bookings] = useState(initialBookings);
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(
    (b) =>
      b.client.toLowerCase().includes(search.toLowerCase()) ||
      b.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage appointments and schedules
          </p>
        </div>
        <button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition">
          <Plus className="h-4 w-4" /> New Booking
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <div className="flex bg-gray-100 rounded-lg p-0.5 ml-auto">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              view === "list" ? "bg-white shadow-sm" : "text-gray-600"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              view === "calendar" ? "bg-white shadow-sm" : "text-gray-600"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Date nav */}
      <div className="flex items-center gap-4 mb-6">
        <button className="p-1.5 rounded-lg hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="font-semibold">Monday, March 23, 2026</h2>
        <button className="p-1.5 rounded-lg hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button className="text-xs text-violet-600 font-medium ml-2">
          Today
        </button>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Time
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Client
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Service
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Therapist
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Duration
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-mono text-gray-500">
                    {b.time}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{b.client}</p>
                    <p className="text-xs text-gray-400">{b.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{b.service}</td>
                  <td className="px-5 py-3.5 text-gray-600">{b.therapist}</td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {b.duration} min
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : b.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-5 border-b border-gray-100">
            <div className="px-3 py-2 bg-gray-50" />
            {therapists.map((t) => (
              <div
                key={t}
                className="px-3 py-2 text-sm font-medium text-center bg-gray-50 border-l border-gray-100"
              >
                {t}
              </div>
            ))}
          </div>
          <div className="divide-y divide-gray-50">
            {timeSlots.map((slot) => {
              const slotBookings = bookings.filter((b) => b.time === slot);
              return (
                <div key={slot} className="grid grid-cols-5 min-h-[40px]">
                  <div className="px-3 py-1.5 text-xs text-gray-400 font-mono border-r border-gray-100">
                    {slot}
                  </div>
                  {therapists.map((t) => {
                    const booking = slotBookings.find(
                      (b) => b.therapist === t
                    );
                    return (
                      <div
                        key={t}
                        className="px-1 py-0.5 border-l border-gray-50"
                      >
                        {booking && (
                          <div className="bg-violet-100 text-violet-800 rounded px-2 py-1 text-xs">
                            <p className="font-medium truncate">
                              {booking.client}
                            </p>
                            <p className="text-violet-600 truncate">
                              {booking.service}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
