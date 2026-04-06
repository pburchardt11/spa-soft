"use client";

import { useState } from "react";
import { Plus, X, Mail, Phone } from "lucide-react";
import { createStaffAction, updateStaffAction, deleteStaffAction } from "@/lib/actions/staff";

type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  color: string;
  active: boolean;
};

const roles = ["owner", "manager", "therapist", "receptionist"];
const colors = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#ec4899"];

type Branch = { id: string; name: string };

export default function StaffClient({
  initialStaff,
  branches = [],
  currentBranchId,
}: {
  initialStaff: Staff[];
  branches?: Branch[];
  currentBranchId?: string | null;
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  function openAdd() {
    setEditingStaff(null);
    setModalError(null);
    setShowModal(true);
  }

  function openEdit(staff: Staff) {
    setEditingStaff(staff);
    setModalError(null);
    setShowModal(true);
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-gray-500 text-sm mt-1">
            {initialStaff.length} team members
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialStaff.map((s) => (
          <div
            key={s.id}
            onClick={() => openEdit(s)}
            className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: s.color }}
              >
                {s.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{s.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.role === "owner" ? "bg-purple-100 text-purple-700" :
                  s.role === "manager" ? "bg-blue-100 text-blue-700" :
                  s.role === "therapist" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {s.role}
                </span>
              </div>
              {!s.active && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Inactive
                </span>
              )}
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <p className="flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> {s.email}
              </p>
              {s.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {s.phone}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {editingStaff ? "Edit Staff" : "Add Staff"}
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
                if (editingStaff) {
                  result = await updateStaffAction(editingStaff.id, formData);
                } else {
                  result = await createStaffAction(formData);
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
                <input name="name" type="text" required defaultValue={editingStaff?.name || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" required defaultValue={editingStaff?.email || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" type="tel" defaultValue={editingStaff?.phone || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" defaultValue={editingStaff?.role || "therapist"} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  {roles.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>
              {branches.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    name="branch_id"
                    defaultValue={(editingStaff as any)?.branch_id || currentBranchId || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {!editingStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex gap-2">
                    {colors.map((c) => (
                      <label key={c} className="cursor-pointer">
                        <input type="radio" name="color" value={c} defaultChecked={c === "#7c3aed"} className="sr-only peer" />
                        <div className="h-8 w-8 rounded-full peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-violet-600" style={{ backgroundColor: c }} />
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {editingStaff && (
                <div className="flex items-center gap-2">
                  <input type="hidden" name="active" value={editingStaff.active ? "true" : "false"} />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked={editingStaff.active}
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
                {editingStaff && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm("Remove this staff member?")) {
                        await deleteStaffAction(editingStaff.id);
                        setShowModal(false);
                        window.location.reload();
                      }
                    }}
                    className="py-2.5 px-4 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
                <div className="flex-1" />
                <button type="button" onClick={() => setShowModal(false)} className="py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="py-2.5 px-4 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
                  {editingStaff ? "Save Changes" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
