import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import StaffClient from "./staff-client";

export default async function StaffPage() {
  const businessId = await getBusinessId();
  if (!businessId) return <div className="p-8">No business found.</div>;

  const admin = await getAdminClient();
  const { data: staff } = await admin
    .from("staff")
    .select("*")
    .eq("business_id", businessId)
    .order("name");

  return <StaffClient initialStaff={staff || []} />;
}
