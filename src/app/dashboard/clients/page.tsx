"use client";

import { useState } from "react";
import { Plus, Search, Mail, Phone, MoreHorizontal } from "lucide-react";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: string;
  tags: string[];
};

const clients: Client[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah@email.com", phone: "(555) 123-4567", visits: 24, lastVisit: "Mar 20, 2026", totalSpent: "$2,880", tags: ["VIP", "Regular"] },
  { id: 2, name: "Michael Chen", email: "michael@email.com", phone: "(555) 234-5678", visits: 18, lastVisit: "Mar 19, 2026", totalSpent: "$2,160", tags: ["Regular"] },
  { id: 3, name: "Jessica Davis", email: "jessica@email.com", phone: "(555) 345-6789", visits: 12, lastVisit: "Mar 18, 2026", totalSpent: "$1,440", tags: ["Regular"] },
  { id: 4, name: "Robert Miller", email: "robert@email.com", phone: "(555) 456-7890", visits: 8, lastVisit: "Mar 15, 2026", totalSpent: "$960", tags: ["New"] },
  { id: 5, name: "Emily Wilson", email: "emily@email.com", phone: "(555) 567-8901", visits: 31, lastVisit: "Mar 22, 2026", totalSpent: "$3,720", tags: ["VIP", "Regular"] },
  { id: 6, name: "David Brown", email: "david@email.com", phone: "(555) 678-9012", visits: 5, lastVisit: "Mar 10, 2026", totalSpent: "$600", tags: ["New"] },
  { id: 7, name: "Anna Lee", email: "anna@email.com", phone: "(555) 789-0123", visits: 15, lastVisit: "Mar 21, 2026", totalSpent: "$1,800", tags: ["Regular"] },
  { id: 8, name: "James Wilson", email: "james@email.com", phone: "(555) 890-1234", visits: 42, lastVisit: "Mar 22, 2026", totalSpent: "$5,040", tags: ["VIP", "Loyalty"] },
  { id: 9, name: "Lisa Anderson", email: "lisa@email.com", phone: "(555) 901-2345", visits: 3, lastVisit: "Mar 8, 2026", totalSpent: "$360", tags: ["New"] },
  { id: 10, name: "Thomas Garcia", email: "thomas@email.com", phone: "(555) 012-3456", visits: 20, lastVisit: "Mar 17, 2026", totalSpent: "$2,400", tags: ["Regular", "Loyalty"] },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const tags = ["VIP", "Regular", "New", "Loyalty"];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">
            {clients.length} total clients
          </p>
        </div>
        <button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition">
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
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setSelectedTag(selectedTag === tag ? null : tag)
              }
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 font-medium text-gray-600">
                Client
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">
                Contact
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">
                Visits
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">
                Last Visit
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">
                Total Spent
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">
                Tags
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <p className="font-medium">{c.name}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="flex items-center gap-1 text-xs">
                      <Mail className="h-3 w-3" /> {c.email}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Phone className="h-3 w-3" /> {c.phone}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-600">{c.visits}</td>
                <td className="px-5 py-3.5 text-gray-600">{c.lastVisit}</td>
                <td className="px-5 py-3.5 font-medium">{c.totalSpent}</td>
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
    </div>
  );
}
