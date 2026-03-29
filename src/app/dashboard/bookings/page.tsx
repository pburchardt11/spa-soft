import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import BookingsClient from "./bookings-client";

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const businessId = await getBusinessId();
  if (!businessId) return <div className="p-8">No business found.</div>;

  const params = await searchParams;
  const viewDate = params.date || new Date().toISOString().split("T")[0];

  const admin = await getAdminClient();

  const { data: bookings } = await admin
    .from("bookings")
    .select("*, client:clients(*), staff:staff(*), service:services(*)")
    .eq("business_id", businessId)
    .gte("start_time", `${viewDate}T00:00:00`)
    .lt("start_time", `${viewDate}T23:59:59`)
    .order("start_time");

  const { data: staffList } = await admin
    .from("staff")
    .select("*")
    .eq("business_id", businessId)
    .eq("active", true)
    .order("name");

  const { data: services } = await admin
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .eq("active", true)
    .order("name");

  const { data: clients } = await admin
    .from("clients")
    .select("id, name")
    .eq("business_id", businessId)
    .order("name");

  return (
    <BookingsClient
      initialBookings={bookings || []}
      staffList={staffList || []}
      services={services || []}
      clients={clients || []}
      businessId={businessId}
      viewDate={viewDate}
    />
  );
}
