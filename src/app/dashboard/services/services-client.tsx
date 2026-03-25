"use client";

import { useState } from "react";
import { Plus, X, Clock, DollarSign } from "lucide-react";
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/lib/actions/services";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  category: string | null;
  active: boolean;
};

const defaultCategories = ["Massage", "Facial", "Wellness", "Body", "Hair", "Nails", "Other"];

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [customCategory, setCustomCategory] = useState("");

  // Derive categories from existing services + defaults
  const existingCategories = Array.from(
    new Set(initialServices.map((s) => s.category).filter(Boolean) as string[])
  );
  const categories = Array.from(
    new Set([...existingCategories, ...defaultCategories])
  ).sort();

  function openAdd() {
    setEditingService(null);
    setModalError(null);
    setShowModal(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setModalError(null);
    setShowModal(true);
  }

  const grouped = initialServices.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            {initialServices.length} services offered
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {Object.entries(grouped).map(([category, services]) => (
        <div key={category} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {category}
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Service</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Duration</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => openEdit(s)}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{s.name}</p>
                      {s.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {s.duration} min
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold">
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="h-3.5 w-3.5" />{Number(s.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        s.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {s.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {initialServices.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No services yet. Click &quot;Add Service&quot; to create your first offering.
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {editingService ? "Edit Service" : "Add Service"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            {modalError && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg">
                {modalError}
              </div>
            )}
            <form
              action={async (formData) => {
                setModalError(null);
                let result;
                if (editingService) {
                  result = await updateServiceAction(editingService.id, formData);
                } else {
                  result = await createServiceAction(formData);
                }
                if (result?.error) {
                  setModalError(result.error);
                } else {
                  setShowModal(false);
                  window.location.reload();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input name="name" type="text" required defaultValue={editingService?.name || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" rows={2} defaultValue={editingService?.description || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input name="duration" type="number" required min="5" step="5" defaultValue={editingService?.duration || 60} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input name="price" type="number" required min="0" step="0.01" defaultValue={editingService?.price || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  name="category"
                  type="text"
                  list="category-options"
                  defaultValue={editingService?.category || ""}
                  placeholder="Select or type a new category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <datalist id="category-options">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="text-xs text-gray-400 mt-1">Pick from the list or type a new category name</p>
              </div>
              {editingService && (
                <div className="flex items-center gap-2">
                  <input type="hidden" name="active" value={editingService.active ? "true" : "false"} />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked={editingService.active}
                      onChange={(e) => {
                        const hidden = e.target.parentElement?.parentElement?.querySelector('input[name="active"]') as HTMLInputElement;
                        if (hidden) hidden.value = e.target.checked ? "true" : "false";
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-violet-600"
                    />
                    Active
                  </label>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {editingService && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Delete this service?")) {
                        await deleteServiceAction(editingService.id);
                        setShowModal(false);
                        window.location.reload();
                      }
                    }}
                    className="py-2.5 px-4 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
                <div className="flex-1" />
                <button type="button" onClick={() => setShowModal(false)} className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="py-2.5 px-4 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
                  {editingService ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
