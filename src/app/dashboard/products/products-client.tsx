"use client";

import { useState } from "react";
import { Plus, Package, ShoppingCart, X, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { createProduct, updateProduct, deleteProduct, recordSale } from "@/lib/actions/products";
import type { Product, ProductSale } from "@/lib/types";

type Sale = ProductSale & {
  product?: { name: string } | null;
  client?: { name: string } | null;
};

export default function ProductsClient({
  initialProducts,
  initialSales,
  clients,
  currency,
}: {
  initialProducts: Product[];
  initialSales: Sale[];
  clients: { id: string; name: string }[];
  currency: string;
}) {
  const [tab, setTab] = useState<"products" | "sales">("products");
  const [products] = useState(initialProducts);
  const [sales] = useState(initialSales);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const symbol = currency === "THB" ? "฿" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  function openCreate() {
    setEditing(null);
    setError(null);
    setShowProductModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setError(null);
    setShowProductModal(true);
  }

  async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = editing
      ? await updateProduct(editing.id, formData)
      : await createProduct(formData);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setShowProductModal(false);
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const result = await deleteProduct(id);
    if (result.error) alert(result.error);
    else window.location.reload();
  }

  async function handleSaleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await recordSale(formData);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setShowSaleModal(false);
      window.location.reload();
    }
  }

  // Aggregate sales stats
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const todaySales = sales.filter((s) => {
    const d = new Date(s.created_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayRevenue = todaySales.reduce((sum, s) => sum + Number(s.total), 0);

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500";

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products & Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage retail products and record sales</p>
        </div>
        <div className="flex gap-2">
          {tab === "products" ? (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          ) : (
            <button
              onClick={() => { setError(null); setShowSaleModal(true); }}
              disabled={products.length === 0}
              className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              New Sale
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === "products" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setTab("sales")}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              tab === "sales" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ShoppingCart className="h-4 w-4 inline mr-2" />
            Sales ({sales.length})
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <>
          {products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products yet. Add your first retail product to get started.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => {
                const lowStock = p.stock <= p.low_stock_threshold;
                const outOfStock = p.stock === 0;
                return (
                  <div key={p.id} className={`bg-white rounded-xl border p-5 ${!p.active ? "opacity-60" : ""} ${lowStock ? "border-amber-300" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{p.name}</p>
                        {p.category && <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {p.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{p.description}</p>}
                    <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-gray-100">
                      <p className="font-bold text-lg text-violet-600">{symbol}{Number(p.price).toFixed(0)}</p>
                      <div className="flex items-center gap-1.5">
                        {lowStock && !outOfStock && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        <span className={`text-xs font-medium ${
                          outOfStock ? "text-red-600" : lowStock ? "text-amber-600" : "text-gray-500"
                        }`}>
                          {outOfStock ? "Out of stock" : `${p.stock} in stock`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Sales Tab */}
      {tab === "sales" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
              <p className="text-2xl font-bold mt-1">{symbol}{todayRevenue.toFixed(0)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{todaySales.length} sale{todaySales.length !== 1 && "s"}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">{symbol}{totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sales.length} sale{sales.length !== 1 && "s"}</p>
            </div>
          </div>

          {sales.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sales recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Product</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Client</th>
                    <th className="text-center text-xs font-semibold text-gray-500 uppercase px-4 py-3">Qty</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Method</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{s.product?.name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.client?.name || "Walk-in"}</td>
                      <td className="px-4 py-3 text-sm text-center">{s.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{s.payment_method?.replace("_", " ") || "—"}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-right">{symbol}{Number(s.total).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-bold text-lg">{editing ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowProductModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input name="name" type="text" required defaultValue={editing?.name || ""} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={2} defaultValue={editing?.description || ""} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input name="category" type="text" placeholder="e.g. Oils, Skincare" defaultValue={editing?.category || ""} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input name="sku" type="text" defaultValue={editing?.sku || ""} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ({symbol}) *</label>
                  <input name="price" type="number" step="0.01" required defaultValue={editing?.price ?? ""} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost ({symbol})</label>
                  <input name="cost" type="number" step="0.01" defaultValue={editing?.cost ?? ""} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input name="stock" type="number" defaultValue={editing?.stock ?? 0} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                  <input name="low_stock_threshold" type="number" defaultValue={editing?.low_stock_threshold ?? 5} className={inputClass} />
                </div>
              </div>
              {editing && (
                <label className="flex items-center gap-2">
                  <input type="hidden" name="active" value={editing.active ? "true" : "false"} />
                  <input
                    type="checkbox"
                    defaultChecked={editing.active}
                    onChange={(e) => {
                      const hidden = e.target.parentElement?.querySelector('input[name="active"]') as HTMLInputElement;
                      if (hidden) hidden.value = e.target.checked ? "true" : "false";
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-violet-600"
                  />
                  <span className="text-sm">Active</span>
                </label>
              )}
              {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-bold text-lg">New Sale</h2>
              <button onClick={() => setShowSaleModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <select name="product_id" required className={inputClass}>
                  <option value="">Select a product...</option>
                  {products.filter((p) => p.active && p.stock > 0).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {symbol}{Number(p.price).toFixed(0)} ({p.stock} in stock)
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input name="quantity" type="number" min="1" defaultValue="1" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select name="payment_method" defaultValue="cash" className={inputClass}>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="promptpay">PromptPay</option>
                    <option value="apple_pay">Apple Pay</option>
                    <option value="google_pay">Google Pay</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client (optional)</label>
                <select name="client_id" defaultValue="none" className={inputClass}>
                  <option value="none">Walk-in customer</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input name="notes" type="text" className={inputClass} />
              </div>
              {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSaleModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50">
                  {saving ? "Recording..." : "Record Sale"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
