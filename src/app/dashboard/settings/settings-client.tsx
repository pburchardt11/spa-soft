"use client";

import { useState } from "react";
import { Save, Copy, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsClient({ business }: { business: Record<string, string> | null }) {
  const [businessName, setBusinessName] = useState(business?.name || "");
  const [email, setEmail] = useState(business?.email || "");
  const [phone, setPhone] = useState(business?.phone || "");
  const [address, setAddress] = useState(business?.address || "");
  const [timezone, setTimezone] = useState(business?.timezone || "America/New_York");
  const [currency, setCurrency] = useState(business?.currency || "USD");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const bookingUrl = business?.id ? `https://www.spa-soft.com/book?id=${business.id}` : "";

  async function handleSave() {
    if (!business?.id) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("businesses")
      .update({ name: businessName, email, phone, address, timezone, currency })
      .eq("id", business.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your business profile and preferences
        </p>
      </div>

      {/* Booking Link */}
      {bookingUrl && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-2">Online Booking Page</h2>
          <p className="text-sm text-gray-600 mb-3">
            Share this link with your clients so they can book appointments online.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={bookingUrl}
              className="flex-1 px-3 py-2 bg-white border border-violet-300 rounded-lg text-sm text-gray-700"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(bookingUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href={bookingUrl}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 border border-violet-300 rounded-lg text-sm font-medium text-violet-600 hover:bg-violet-50 transition"
            >
              <ExternalLink className="h-4 w-4" /> Open
            </a>
          </div>
        </div>
      )}

      {/* Business info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4">Business Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4">Preferences</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
