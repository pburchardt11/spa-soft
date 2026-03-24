"use client";

import { useState, useEffect } from "react";
import { Sparkles, Calendar, Clock, CheckCircle } from "lucide-react";

type Service = { id: string; name: string; description: string | null; duration: number; price: number; category: string | null };
type Staff = { id: string; name: string; color: string };
type Business = { name: string; timezone: string; currency: string };

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bid = params.get("id");
    if (!bid) {
      // Try to fetch the first business (for single-tenant demo)
      fetch("/api/book/discover")
        .then((r) => r.json())
        .then((d) => {
          if (d.business_id) {
            setBusinessId(d.business_id);
          } else {
            setLoading(false);
            setError("No business found. Please use the booking link provided by your spa.");
          }
        })
        .catch(() => {
          setLoading(false);
          setError("Unable to load booking page.");
        });
    } else {
      setBusinessId(bid);
    }
  }, []);

  useEffect(() => {
    if (!businessId) return;
    fetch(`/api/book?business_id=${businessId}`)
      .then((r) => r.json())
      .then((data) => {
        setServices(data.services || []);
        setStaff(data.staff || []);
        setBusiness(data.business);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load booking data.");
        setLoading(false);
      });
  }, [businessId]);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00",
  ];

  async function handleSubmit() {
    if (!businessId || !selectedService || !selectedDate || !selectedTime || !clientName || !clientEmail) return;

    setSubmitting(true);
    setError(null);

    const startTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_id: businessId,
        service_id: selectedService.id,
        staff_id: selectedStaff || null,
        start_time: startTime,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (data.success) {
      setBooked(true);
    } else {
      setError(data.error || "Booking failed. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your appointment for <strong>{selectedService?.name}</strong> on{" "}
            <strong>{new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>{" "}
            at <strong>{selectedTime}</strong> has been submitted.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            You&apos;ll receive a confirmation once the spa reviews your booking.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Powered by <span className="font-semibold text-violet-600">SpaSoft</span>
          </div>
        </div>
      </div>
    );
  }

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-violet-600" />
            <span className="font-bold">{business?.name || "SpaSoft"}</span>
          </div>
          <span className="text-sm text-gray-500">Online Booking</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["Service", "Date & Time", "Your Details"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1 ? "bg-green-500 text-white" :
                step === i + 1 ? "bg-violet-600 text-white" :
                "bg-gray-200 text-gray-500"
              }`}>
                {step > i + 1 ? "\u2713" : i + 1}
              </div>
              <span className={`text-sm font-medium ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
              {i < 2 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>
        )}

        {/* Step 1: Choose Service */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Choose a Service</h2>
            {Object.entries(grouped).map(([cat, svcs]) => (
              <div key={cat} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{cat}</h3>
                <div className="space-y-2">
                  {svcs.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedService(s); setStep(2); }}
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        selectedService?.id === s.id
                          ? "border-violet-600 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-violet-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-violet-600">${Number(s.price).toFixed(0)}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {s.duration} min
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Pick a Date & Time</h2>

            {staff.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Therapist (optional)</label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedStaff("")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      !selectedStaff ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    No preference
                  </button>
                  {staff.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStaff(s.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedStaff === s.id ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="flex gap-2 flex-wrap">
                {dates.map((d) => {
                  const date = new Date(d + "T12:00:00");
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`px-3 py-2 rounded-lg text-center transition ${
                        selectedDate === d
                          ? "bg-violet-600 text-white"
                          : "bg-white border border-gray-200 hover:border-violet-300"
                      }`}
                    >
                      <p className="text-xs font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</p>
                      <p className="text-sm font-bold">{date.getDate()}</p>
                      <p className="text-xs">{date.toLocaleDateString("en-US", { month: "short" })}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        selectedTime === t
                          ? "bg-violet-600 text-white"
                          : "bg-white border border-gray-200 hover:border-violet-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Back
              </button>
              <button
                onClick={() => selectedDate && selectedTime && setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="py-2.5 px-6 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Your Details */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Details</h2>

            {/* Summary */}
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6">
              <p className="font-semibold">{selectedService?.name}</p>
              <p className="text-sm text-gray-600 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {selectedTime}
                </span>
              </p>
              <p className="text-sm font-bold text-violet-600 mt-1">${Number(selectedService?.price).toFixed(0)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !clientName || !clientEmail}
                className="py-2.5 px-6 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-400">
          Powered by <span className="font-semibold text-violet-600">SpaSoft</span> &middot; spa-soft.com
        </div>
      </div>
    </div>
  );
}
