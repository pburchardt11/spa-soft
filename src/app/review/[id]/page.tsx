"use client";

import { useState, useEffect, use } from "react";
import { Star, Sparkles, CheckCircle } from "lucide-react";

type BookingInfo = {
  service_name: string;
  staff_name: string;
  business_name: string;
  date: string;
  time: string;
  already_reviewed: boolean;
};

export default function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?booking_id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBooking(data);
          if (data.already_reviewed) {
            setSubmitted(true);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load booking details");
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit() {
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: id, rating, comment }),
    });
    const data = await res.json();

    setSubmitting(false);

    if (data.error) {
      setError(data.error);
    } else {
      setSubmitted(true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank you!</h1>
          <p className="text-gray-600">Your feedback has been received.</p>
          <div className="mt-4 text-sm text-gray-400">
            Powered by <span className="font-semibold text-violet-600">SpaSoft</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-5 w-5 text-violet-600 shrink-0" />
            <span className="font-bold text-sm truncate">{booking?.business_name || "SpaSoft"}</span>
          </div>
          <span className="text-xs text-gray-500">Leave a Review</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">How was your visit?</h1>
        <p className="text-sm text-gray-600 mb-6">
          Your feedback helps us improve.
        </p>

        {/* Booking summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <p className="font-semibold">{booking?.service_name}</p>
          <p className="text-sm text-gray-500 mt-1">
            with {booking?.staff_name} · {booking?.date} at {booking?.time}
          </p>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Your rating</label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition active:scale-95"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={`h-12 w-12 ${
                    (hover || rating) >= n
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tell us more <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="What did you enjoy? Anything we can improve?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>
        )}

        <div className="mt-8 text-center text-xs text-gray-400">
          Powered by <span className="font-semibold text-violet-600">SpaSoft</span>
        </div>
      </div>

      {/* Sticky submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-20 safe-bottom">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={submitting || !rating}
            className="w-full py-3 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition disabled:opacity-50 active:scale-[0.98]"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
