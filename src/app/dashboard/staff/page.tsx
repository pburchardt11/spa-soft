import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import { getCurrentBranchId, listBranches } from "@/lib/actions/branches";
import StaffClient from "./staff-client";

export default async function StaffPage() {
  const businessId = await getBusinessId();
  if (!businessId) return <div className="p-8">No business found.</div>;

  const branchId = await getCurrentBranchId();
  const branches = await listBranches();

  const admin = await getAdminClient();
  let query = admin
    .from("staff")
    .select("*")
    .eq("business_id", businessId)
    .order("name");
  if (branchId) query = query.eq("branch_id", branchId);
  const { data: staff } = await query;

  return <StaffClient initialStaff={staff || []} branches={branches} currentBranchId={branchId} />;
}
