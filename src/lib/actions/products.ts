"use server";

import { revalidatePath } from "next/cache";
import { getBusinessId, getAdminClient } from "./helpers";
import { getCurrentBranchId } from "./branches";

export async function createProduct(formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const branchId = await getCurrentBranchId();

  const { error } = await admin.from("products").insert({
    business_id: businessId,
    branch_id: branchId,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    sku: (formData.get("sku") as string) || null,
    category: (formData.get("category") as string) || null,
    price: parseFloat(formData.get("price") as string) || 0,
    cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : null,
    stock: parseInt(formData.get("stock") as string) || 0,
    low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 5,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const { error } = await admin
    .from("products")
    .update({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      sku: (formData.get("sku") as string) || null,
      category: (formData.get("category") as string) || null,
      price: parseFloat(formData.get("price") as string) || 0,
      cost: formData.get("cost") ? parseFloat(formData.get("cost") as string) : null,
      stock: parseInt(formData.get("stock") as string) || 0,
      low_stock_threshold: parseInt(formData.get("low_stock_threshold") as string) || 5,
      active: formData.get("active") === "true",
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const { error } = await admin
    .from("products")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function recordSale(formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const branchId = await getCurrentBranchId();
  const productId = formData.get("product_id") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const clientId = (formData.get("client_id") as string) || null;
  const paymentMethod = (formData.get("payment_method") as string) || "cash";
  const notes = (formData.get("notes") as string) || null;

  // Fetch product to get current price and stock
  const { data: product, error: prodError } = await admin
    .from("products")
    .select("price, stock")
    .eq("id", productId)
    .single();

  if (prodError || !product) return { error: "Product not found" };

  if (product.stock < quantity) {
    return { error: `Not enough stock (only ${product.stock} available)` };
  }

  const unitPrice = Number(product.price);
  const total = unitPrice * quantity;

  // Insert sale
  const { error: saleError } = await admin.from("product_sales").insert({
    business_id: businessId,
    branch_id: branchId,
    product_id: productId,
    client_id: clientId === "none" ? null : clientId,
    quantity,
    unit_price: unitPrice,
    total,
    payment_method: paymentMethod,
    notes,
  });

  if (saleError) return { error: saleError.message };

  // Decrement stock
  const { error: stockError } = await admin
    .from("products")
    .update({ stock: product.stock - quantity })
    .eq("id", productId);

  if (stockError) return { error: stockError.message };

  revalidatePath("/dashboard/products");
  return { success: true };
}
