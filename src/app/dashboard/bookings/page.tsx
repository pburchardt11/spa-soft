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

  // Get staff schedules and absences for calendar view
  const dow = new Date(viewDate + "T12:00:00").getDay();
  const { data: staffSchedules } = await admin
    .from("staff_schedules")
    .select("staff_id, day_of_week, shift:shifts(start_time, end_time)")
    .eq("business_id", businessId)
    .eq("day_of_week", dow);

  const { data: absences } = await admin
    .from("staff_absences")
    .select("staff_id, type")
    .eq("business_id", businessId)
    .eq("date", viewDate);

  return (
    <BookingsClient
      initialBookings={bookings || []}
      staffList={staffList || []}
      services={services || []}
      clients={clients || []}
      businessId={businessId}
      viewDate={viewDate}
      staffSchedules={(staffSchedules || []).map((s) => ({
        staff_id: s.staff_id,
        start_time: (s.shift as unknown as { start_time: string })?.start_time?.slice(0, 5) || null,
        end_time: (s.shift as unknown as { end_time: string })?.end_time?.slice(0, 5) || null,
      }))}
      absences={(absences || []).map((a) => ({ staff_id: a.staff_id, type: a.type }))}
    />
  );
}
