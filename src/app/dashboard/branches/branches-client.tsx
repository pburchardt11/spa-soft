"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Phone, Mail, X, Star } from "lucide-react";
import { createBranch, updateBranch, deleteBranch } from "@/lib/actions/branches";
import type { Branch } from "@/lib/types";

export default function BranchesClient({ initialBranches }: { initialBranches: Branch[] }) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setError(null);
    setShowModal(true);
  }

  function openEdit(branch: Branch) {
    setEditing(branch);
    setError(null);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = editing
      ? await updateBranch(editing.id, formData)
      : await createBranch(formData);

    setSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      setShowModal(false);
      // Reload branches by reloading the page
      window.location.reload();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    const result = await deleteBranch(id);
    if (result.error) {
      alert(result.error);
    } else {
      setBranches(branches.filter((b) => b.id !== id));
    }
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500";

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Branches</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your spa locations
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </button>
      </div>

      {branches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No branches yet. Add your first location to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-violet-300 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{branch.name}</h3>
                  {branch.is_primary && (
                    <span className="flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3" /> Primary
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(branch)}
                    className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {!branch.is_primary && (
                    <button
                      onClick={() => handleDelete(branch.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                {branch.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {branch.address}
                  </p>
                )}
                {branch.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {branch.phone}
                  </p>
                )}
                {branch.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {branch.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="font-bold text-lg">
                {editing ? "Edit Branch" : "Add Branch"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={editing?.name || ""}
                  placeholder="e.g. Downtown Branch"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={editing?.address || ""}
                  placeholder="Street address"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={editing?.phone || ""}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editing?.email || ""}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone (optional)</label>
                <select name="timezone" defaultValue={editing?.timezone || ""} className={inputClass}>
                  <option value="">Use business default</option>
                  <option value="Asia/Bangkok">Bangkok (ICT, +7)</option>
                  <option value="Asia/Singapore">Singapore (SGT, +8)</option>
                  <option value="Asia/Tokyo">Tokyo (JST, +9)</option>
                  <option value="Asia/Shanghai">Shanghai (CST, +8)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="America/New_York">New York (ET)</option>
                  <option value="America/Los_Angeles">Los Angeles (PT)</option>
                </select>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg">{error}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
