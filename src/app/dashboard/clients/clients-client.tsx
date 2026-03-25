"use client";

import { useState } from "react";
import { Plus, Search, Mail, Phone, MoreHorizontal, X } from "lucide-react";
import { createClientAction } from "@/lib/actions/clients";

type ClientWithStats = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  tags: string[];
  visits: number;
  lastVisit: string | null;
  totalSpent: number;
};

export default function ClientsClient({
  initialClients,
}: {
  initialClients: ClientWithStats[];
}) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const allTags = Array.from(
    new Set(initialClients.flatMap((c) => c.tags))
  ).filter(Boolean);

  const filtered = initialClients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">
            {initialClients.length} total clients
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              !selectedTag
                ? "bg-violet-100 text-violet-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedTag === tag
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Client table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-600">Client</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Contact</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Visits</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Last Visit</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Total Spent</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Tags</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition cursor-pointer">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <p className="font-medium">{c.name}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 text-gray-500">
                    {c.email && (
                      <span className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" /> {c.email}
                      </span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{c.visits}</td>
                <td className="px-5 py-3.5 text-gray-600">
                  {c.lastVisit
                    ? new Date(c.lastVisit).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="px-5 py-3.5 font-medium">${c.totalSpent.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          tag === "VIP"
                            ? "bg-purple-100 text-purple-700"
                            : tag === "Loyalty"
                            ? "bg-amber-100 text-amber-700"
                            : tag === "New"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Add Client</h2>
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
                const result = await createClientAction(formData);
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
                <input name="name" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input name="tags" type="text" placeholder="VIP, Regular" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
