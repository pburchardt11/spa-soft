import Sidebar from "@/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/actions/helpers";
import { listBranches, getCurrentBranchId } from "@/lib/actions/branches";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let businessName = "My Spa";
  if (user) {
    // Use admin client to avoid RLS recursion on staff table
    const admin = await getAdminClient();
    const { data: staffRow } = await admin
      .from("staff")
      .select("business_id, businesses(name)")
      .eq("auth_user_id", user.id)
      .single();

    if (staffRow?.businesses) {
      const biz = staffRow.businesses as unknown as { name: string };
      businessName = biz.name;
    }
  }

  const branches = await listBranches();
  const currentBranchId = await getCurrentBranchId();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        businessName={businessName}
        userEmail={user?.email}
        branches={branches}
        currentBranchId={currentBranchId}
      />
      <main className="flex-1 bg-gray-50 overflow-auto pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
