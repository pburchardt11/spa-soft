import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/actions/helpers";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "pburchardt@gmx.de").split(",").map((e) => e.trim().toLowerCase());

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
    redirect("/login");
  }

  const admin = await getAdminClient();

  // All businesses with owner info
  const { data: businesses } = await admin
    .from("businesses")
    .select("id, name, email, plan, subscription_plan, subscription_status, currency, created_at")
    .order("created_at", { ascending: false });

  // Staff counts per business
  const { data: staffCounts } = await admin
    .from("staff")
    .select("business_id");

  // Booking counts per business
  const { data: bookingCounts } = await admin
    .from("bookings")
    .select("business_id");

  // Client counts per business
  const { data: clientCounts } = await admin
    .from("clients")
    .select("business_id");

  // Recent signups (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentBusinesses } = await admin
    .from("businesses")
    .select("id")
    .gte("created_at", thirtyDaysAgo);

  // Count totals
  const countByBusiness = (items: { business_id: string }[] | null, bizId: string) =>
    (items || []).filter((i) => i.business_id === bizId).length;

  const enriched = (businesses || []).map((b) => ({
    ...b,
    staff_count: countByBusiness(staffCounts, b.id),
    booking_count: countByBusiness(bookingCounts, b.id),
    client_count: countByBusiness(clientCounts, b.id),
  }));

  const stats = {
    total_businesses: businesses?.length || 0,
    recent_signups: recentBusinesses?.length || 0,
    total_bookings: bookingCounts?.length || 0,
    total_clients: clientCounts?.length || 0,
    active_subscriptions: (businesses || []).filter((b) => b.subscription_status === "active").length,
  };

  return <AdminClient businesses={enriched} stats={stats} />;
}
