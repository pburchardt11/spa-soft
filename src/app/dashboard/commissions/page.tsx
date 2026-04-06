import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import { getCurrentBranchId } from "@/lib/actions/branches";
import CommissionsClient from "./commissions-client";

export default async function CommissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const businessId = await getBusinessId();
  if (!businessId) return <div className="p-8">No business found.</div>;

  const branchId = await getCurrentBranchId();
  const params = await searchParams;

  // Default to current month
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const from = params.from || defaultFrom;
  const to = params.to || defaultTo;

  const admin = await getAdminClient();

  // Fetch staff
  let staffQuery = admin
    .from("staff")
    .select("id, name, color, commission_rate, role")
    .eq("business_id", businessId)
    .eq("active", true)
    .order("name");
  if (branchId) staffQuery = staffQuery.eq("branch_id", branchId);
  const { data: staffList } = await staffQuery;

  // Fetch completed bookings in date range
  let bookingsQuery = admin
    .from("bookings")
    .select("id, start_time, staff_id, service_id, services(name, price, commission_rate), client:clients(name)")
    .eq("business_id", businessId)
    .eq("status", "completed")
    .gte("start_time", `${from}T00:00:00`)
    .lte("start_time", `${to}T23:59:59`)
    .order("start_time", { ascending: false });
  if (branchId) bookingsQuery = bookingsQuery.eq("branch_id", branchId);
  const { data: bookings } = await bookingsQuery;

  // Currency
  const { data: business } = await admin
    .from("businesses")
    .select("currency")
    .eq("id", businessId)
    .single();

  return (
    <CommissionsClient
      staff={(staffList as any) || []}
      bookings={(bookings as any) || []}
      from={from}
      to={to}
      currency={business?.currency || "THB"}
    />
  );
}
