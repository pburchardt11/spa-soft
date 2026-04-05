"use client";

import { useState } from "react";
import { Save, Copy, ExternalLink, Mail, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveNotificationSettings } from "@/lib/actions/notifications";
import type { NotificationSettings } from "@/lib/types";

export default function SettingsClient({
  business,
  notificationSettings,
}: {
  business: Record<string, string> | null;
  notificationSettings: NotificationSettings | null;
}) {
  const [businessName, setBusinessName] = useState(business?.name || "");
  const [email, setEmail] = useState(business?.email || "");
  const [phone, setPhone] = useState(business?.phone || "");
  const [address, setAddress] = useState(business?.address || "");
  const [timezone, setTimezone] = useState(business?.timezone || "Asia/Bangkok");
  const [currency, setCurrency] = useState(business?.currency || "THB");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const bookingUrl = business?.id ? `https://www.spa-soft.com/book?id=${business.id}` : "";

  // Notification settings state
  const [emailEnabled, setEmailEnabled] = useState(notificationSettings?.email_enabled ?? true);
  const [emailFromName, setEmailFromName] = useState(notificationSettings?.email_from_name || "");
  const [lineEnabled, setLineEnabled] = useState(notificationSettings?.line_enabled ?? false);
  const [lineAccessToken, setLineAccessToken] = useState(notificationSettings?.line_channel_access_token || "");
  const [lineSecret, setLineSecret] = useState(notificationSettings?.line_channel_secret || "");
  const [whatsappEnabled, setWhatsappEnabled] = useState(notificationSettings?.whatsapp_enabled ?? false);
  const [whatsappToken, setWhatsappToken] = useState(notificationSettings?.whatsapp_access_token || "");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState(notificationSettings?.whatsapp_phone_number_id || "");
  const [reminderHours, setReminderHours] = useState(notificationSettings?.reminder_hours_before ?? 2);
  const [savingNotif, setSavingNotif] = useState(false);
  const [savedNotif, setSavedNotif] = useState(false);

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

  async function handleSaveNotifications() {
    setSavingNotif(true);
    const formData = new FormData();
    formData.set("email_enabled", String(emailEnabled));
    formData.set("email_from_name", emailFromName);
    formData.set("line_enabled", String(lineEnabled));
    formData.set("line_channel_access_token", lineAccessToken);
    formData.set("line_channel_secret", lineSecret);
    formData.set("whatsapp_enabled", String(whatsappEnabled));
    formData.set("whatsapp_access_token", whatsappToken);
    formData.set("whatsapp_phone_number_id", whatsappPhoneId);
    formData.set("reminder_hours_before", String(reminderHours));
    await saveNotificationSettings(formData);
    setSavingNotif(false);
    setSavedNotif(true);
    setTimeout(() => setSavedNotif(false), 2000);
  }

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500";

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your business profile, notifications, and preferences
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
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4">Preferences</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
              <option value="Asia/Bangkok">Bangkok (ICT, +7)</option>
              <option value="Asia/Singapore">Singapore (SGT, +8)</option>
              <option value="Asia/Tokyo">Tokyo (JST, +9)</option>
              <option value="Asia/Shanghai">Shanghai (CST, +8)</option>
              <option value="Asia/Kolkata">India (IST, +5:30)</option>
              <option value="Europe/London">London (GMT/BST)</option>
              <option value="Europe/Berlin">Berlin (CET/CEST)</option>
              <option value="America/New_York">New York (ET)</option>
              <option value="America/Chicago">Chicago (CT)</option>
              <option value="America/Denver">Denver (MT)</option>
              <option value="America/Los_Angeles">Los Angeles (PT)</option>
              <option value="Australia/Sydney">Sydney (AEST, +10)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
              <option value="THB">THB (฿)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (&euro;)</option>
              <option value="GBP">GBP (&pound;)</option>
              <option value="SGD">SGD ($)</option>
              <option value="JPY">JPY (&yen;)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50 mb-10"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
      </button>

      {/* Notification Settings */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-xl font-bold mb-1">Notifications</h2>
        <p className="text-gray-500 text-sm mb-6">
          Configure how your clients receive booking updates
        </p>

        {/* Reminder timing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold mb-3">Reminder Timing</h3>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Send reminder</label>
            <select
              value={reminderHours}
              onChange={(e) => setReminderHours(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
            </select>
            <span className="text-sm text-gray-700">before appointment</span>
          </div>
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Email Notifications</h3>
                <p className="text-sm text-gray-500">Send booking confirmations and reminders via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
            </label>
          </div>
          {emailEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
              <input
                type="text"
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                placeholder={businessName || "Your Spa Name"}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                The name that appears in the &quot;From&quot; field of notification emails
              </p>
            </div>
          )}
        </div>

        {/* LINE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">LINE Notifications</h3>
                <p className="text-sm text-gray-500">Send updates via LINE Official Account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={lineEnabled}
                onChange={(e) => setLineEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
            </label>
          </div>
          {lineEnabled && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  Create a LINE Official Account and Messaging API channel at{" "}
                  <a href="https://developers.line.biz/" target="_blank" className="underline font-medium">
                    developers.line.biz
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel Access Token</label>
                <input
                  type="password"
                  value={lineAccessToken}
                  onChange={(e) => setLineAccessToken(e.target.value)}
                  placeholder="Enter your LINE Channel Access Token"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel Secret</label>
                <input
                  type="password"
                  value={lineSecret}
                  onChange={(e) => setLineSecret(e.target.value)}
                  placeholder="Enter your LINE Channel Secret"
                  className={inputClass}
                />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <strong>Webhook URL:</strong> Set this in your LINE Developer Console:
                </p>
                <code className="text-xs text-violet-600 break-all">
                  {typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"}/api/webhooks/line
                </code>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold">WhatsApp Notifications</h3>
                <p className="text-sm text-gray-500">Send updates via WhatsApp Business API</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
          {whatsappEnabled && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-sm text-emerald-800">
                  Set up a WhatsApp Business account at{" "}
                  <a href="https://business.facebook.com/" target="_blank" className="underline font-medium">
                    business.facebook.com
                  </a>
                  . You&apos;ll need to create message templates for booking notifications.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <input
                  type="password"
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  placeholder="Enter your WhatsApp Access Token"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
                <input
                  type="text"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  placeholder="Enter your WhatsApp Phone Number ID"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSaveNotifications}
          disabled={savingNotif}
          className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {savingNotif ? "Saving..." : savedNotif ? "Saved!" : "Save Notification Settings"}
        </button>
      </div>
    </div>
  );
}
