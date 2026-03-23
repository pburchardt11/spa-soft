"use client";

import { useState } from "react";
import { Plus, Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import { createBooking, updateBookingStatus } from "@/lib/actions/bookings";
import type { Booking, Staff, Service, Client } from "@/lib/types";

type BookingWithRelations = Booking & {
  client: Client | null;
  staff: Staff | null;
  service: Service | null;
};

export default function BookingsClient({
  initialBookings,
  staffList,
  services,
  clients,
}: {
  initialBookings: BookingWithRelations[];
  staffList: Staff[];
  services: Service[];
  clients: { id: string; name: string }[];
}) {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = initialBookings.filter(
    (b) =>
      (b.client?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.service?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage appointments and schedules
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
        >
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
        <h2 className="font-semibold">{dateStr}</h2>
        <button className="p-1.5 rounded-lg hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 font-medium text-gray-600">Time</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Client</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Service</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Therapist</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Duration</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 font-mono text-gray-500">
                      {new Date(b.start_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{b.client?.name || "Walk-in"}</p>
                      <p className="text-xs text-gray-400">{b.client?.phone || ""}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{b.service?.name || "-"}</td>
                    <td className="px-5 py-3.5 text-gray-600">{b.staff?.name || "-"}</td>
                    <td className="px-5 py-3.5 text-gray-600">{b.service?.duration || 0} min</td>
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
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        {b.status === "pending" && (
                          <button
                            onClick={() => updateBookingStatus(b.id, "confirmed")}
                            className="text-xs text-green-600 hover:underline"
                          >
                            Confirm
                          </button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button
                            onClick={() => updateBookingStatus(b.id, "cancelled")}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-5 border-b border-gray-100">
            <div className="px-3 py-2 bg-gray-50" />
            {staffList.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="px-3 py-2 text-sm font-medium text-center bg-gray-50 border-l border-gray-100"
              >
                {t.name}
              </div>
            ))}
          </div>
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 17 }, (_, i) => {
              const hour = 9 + Math.floor(i / 2);
              const min = i % 2 === 0 ? "00" : "30";
              const label =
                hour > 12
                  ? `${hour - 12}:${min} PM`
                  : hour === 12
                  ? `12:${min} PM`
                  : `${hour}:${min} AM`;

              return (
                <div key={i} className="grid grid-cols-5 min-h-[40px]">
                  <div className="px-3 py-1.5 text-xs text-gray-400 font-mono border-r border-gray-100">
                    {label}
                  </div>
                  {staffList.slice(0, 4).map((t) => {
                    const booking = initialBookings.find((b) => {
                      const bHour = new Date(b.start_time).getHours();
                      const bMin = new Date(b.start_time).getMinutes();
                      return b.staff?.id === t.id && bHour === hour && Math.abs(bMin - Number(min)) < 15;
                    });
                    return (
                      <div key={t.id} className="px-1 py-0.5 border-l border-gray-50">
                        {booking && (
                          <div className="bg-violet-100 text-violet-800 rounded px-2 py-1 text-xs">
                            <p className="font-medium truncate">{booking.client?.name}</p>
                            <p className="text-violet-600 truncate">{booking.service?.name}</p>
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

      {/* New Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">New Booking</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form
              action={async (formData) => {
                await createBooking(formData);
                setShowModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <select name="client_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select name="service_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">Select service...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.duration} min — ${s.price})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
                <select name="staff_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="">Select therapist...</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                <input name="start_time" type="datetime-local" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
