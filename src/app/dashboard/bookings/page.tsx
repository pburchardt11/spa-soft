import { createClient } from "@/lib/supabase/server";
import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import BookingsClient from "./bookings-client";

export default async function BookingsPage() {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  const admin = await getAdminClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, client:clients(*), staff:staff(*), service:services(*)")
    .gte("start_time", `${today}T00:00:00`)
    .lt("start_time", `${today}T23:59:59`)
    .order("start_time");

  // Use admin client for staff to avoid RLS recursion
  const { data: staffList } = await admin
    .from("staff")
    .select("*")
    .eq("business_id", businessId!)
    .eq("active", true)
    .order("name");

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("name");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <BookingsClient
      initialBookings={bookings || []}
      staffList={staffList || []}
      services={services || []}
      clients={clients || []}
    />
  );
}
