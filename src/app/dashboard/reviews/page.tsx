import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import { getCurrentBranchId } from "@/lib/actions/branches";
import ReviewsClient from "./reviews-client";

export default async function ReviewsPage() {
  const businessId = await getBusinessId();
  if (!businessId) return <div className="p-8">No business found.</div>;

  const branchId = await getCurrentBranchId();
  const admin = await getAdminClient();

  let query = admin
    .from("reviews")
    .select("*, client:clients(name), staff:staff(name, color)")
    .eq("business_id", businessId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (branchId) query = query.eq("branch_id", branchId);

  const { data: reviews } = await query;

  // Fallback: also fetch service via booking separately since the nested join above is complex
  const enrichedReviews = await Promise.all(
    (reviews || []).map(async (r) => {
      if (r.booking_id) {
        const { data: booking } = await admin
          .from("bookings")
          .select("services(name)")
          .eq("id", r.booking_id)
          .single();
        return { ...r, service: (booking?.services as any) || null };
      }
      return r;
    })
  );

  return <ReviewsClient reviews={enrichedReviews as any} />;
}
