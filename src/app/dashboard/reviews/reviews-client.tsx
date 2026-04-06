"use client";

import { useState, useMemo } from "react";
import { Star, MessageSquare } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  client: { name: string } | null;
  staff: { name: string; color: string } | null;
  service: { name: string } | null;
};

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<number | null>(null);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      distribution[r.rating - 1]++;
    });
    return {
      avg: sum / reviews.length,
      count: reviews.length,
      distribution,
    };
  }, [reviews]);

  const filteredReviews = filter
    ? reviews.filter((r) => r.rating === filter)
    : reviews;

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">
          Customer feedback and ratings
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-1">
          <p className="text-sm text-gray-500 mb-2">Average Rating</p>
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-4xl font-bold">{stats.avg.toFixed(1)}</p>
            <p className="text-gray-400 text-sm">/ 5</p>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-5 w-5 ${
                  n <= Math.round(stats.avg)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Based on {stats.count} reviews</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-2">
          <p className="text-sm text-gray-500 mb-3">Rating Distribution</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.distribution[stars - 1];
              const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
              return (
                <button
                  key={stars}
                  onClick={() => setFilter(filter === stars ? null : stars)}
                  className={`w-full flex items-center gap-3 group ${
                    filter === stars ? "font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center gap-1 w-12 shrink-0">
                    <span className="text-sm text-gray-600">{stars}</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                </button>
              );
            })}
          </div>
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="text-xs text-violet-600 mt-3 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Reviews list */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {reviews.length === 0
              ? "No reviews yet. Reviews will appear here when clients leave feedback after their appointments."
              : "No reviews match this filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-semibold">{review.client?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {review.service?.name && <>{review.service.name} · </>}
                    {review.staff?.name && <>with {review.staff.name} · </>}
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${
                        n <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
