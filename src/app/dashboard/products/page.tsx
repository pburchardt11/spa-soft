import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import { getCurrentBranchId } from "@/lib/actions/branches";
import ProductsClient from "./products-client";

export default async function ProductsPage() {
  const businessId = await getBusinessId();
  if (!businessId) return <div className="p-8">No business found.</div>;

  const branchId = await getCurrentBranchId();
  const admin = await getAdminClient();

  let productsQuery = admin
    .from("products")
    .select("*")
    .eq("business_id", businessId)
    .order("name");
  if (branchId) productsQuery = productsQuery.or(`branch_id.eq.${branchId},branch_id.is.null`);
  const { data: products } = await productsQuery;

  let salesQuery = admin
    .from("product_sales")
    .select("*, product:products(name), client:clients(name)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (branchId) salesQuery = salesQuery.eq("branch_id", branchId);
  const { data: sales } = await salesQuery;

  const { data: clients } = await admin
    .from("clients")
    .select("id, name")
    .eq("business_id", businessId)
    .order("name");

  // Currency from business
  const { data: business } = await admin
    .from("businesses")
    .select("currency")
    .eq("id", businessId)
    .single();

  return (
    <ProductsClient
      initialProducts={products || []}
      initialSales={(sales as any) || []}
      clients={clients || []}
      currency={business?.currency || "THB"}
    />
  );
}
