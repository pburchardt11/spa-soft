"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Rocket,
  Calendar,
  Users,
  UserCog,
  Scissors,
  Package,
  CalendarClock,
  CreditCard,
  DollarSign,
  Star,
  MapPin,
  BarChart3,
  Settings,
  Bell,
  Receipt,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Section = {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  content: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "getting-started",
    icon: Rocket,
    title: "Getting Started",
    summary: "Your first steps after signing up",
    content: (
      <>
        <p>Welcome to SpaSoft! Here&apos;s what to do first:</p>
        <ol className="list-decimal ml-5 space-y-2 mt-3">
          <li>Go to <strong>Settings</strong> and fill in your business details: name, phone, address, timezone, and currency.</li>
          <li>Go to <strong>Branches</strong> and rename your main location (or add more branches if you have multiple spas).</li>
          <li>Add your <strong>Staff</strong> members with their roles and commission rates.</li>
          <li>Add your <strong>Services</strong> with prices and durations.</li>
          <li>Set your <strong>Schedule</strong> — opening hours, shifts, and staff assignments.</li>
          <li>In <strong>Settings → Online Booking Page</strong>, copy your public booking link and share it with customers.</li>
        </ol>
      </>
    ),
  },
  {
    id: "bookings",
    icon: Calendar,
    title: "Bookings",
    summary: "Create, view, and manage appointments",
    content: (
      <>
        <p><strong>View bookings:</strong> Switch between List view (table) and Calendar view (staff columns). Use the arrows or &quot;Today&quot; button to navigate dates.</p>
        <p className="mt-3"><strong>Create a booking:</strong> Click &quot;New Booking&quot;, pick client (or create new), service, therapist, date and time. The system checks for conflicts.</p>
        <p className="mt-3"><strong>Booking statuses:</strong></p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li><strong>Pending</strong> — needs confirmation</li>
          <li><strong>Confirmed</strong> — locked in (triggers confirmation notification)</li>
          <li><strong>Completed</strong> — customer visited (triggers review request + commission tracking)</li>
          <li><strong>Cancelled</strong> — no longer happening</li>
        </ul>
        <p className="mt-3 text-amber-700 bg-amber-50 p-3 rounded-lg text-sm">
          💡 <strong>Important:</strong> Mark bookings as <em>Completed</em> after each visit — this is what triggers review requests and counts the commission.
        </p>
      </>
    ),
  },
  {
    id: "clients",
    icon: Users,
    title: "Clients",
    summary: "Customer CRM with tags and history",
    content: (
      <>
        <p>All your customers are listed here. Search by name or email, filter by tags.</p>
        <p className="mt-3"><strong>Tags</strong> like &quot;VIP&quot;, &quot;Regular&quot;, &quot;New&quot; help you segment clients. You can add custom tags.</p>
        <p className="mt-3"><strong>Per-client info:</strong> visit count, last visit, total spent, notes.</p>
        <p className="mt-3">Clients are shared across all branches — a customer can visit any of your locations.</p>
      </>
    ),
  },
  {
    id: "staff",
    icon: UserCog,
    title: "Staff",
    summary: "Team members, roles, and commissions",
    content: (
      <>
        <p><strong>Roles:</strong></p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li><strong>Owner</strong> — full access</li>
          <li><strong>Manager</strong> — manage bookings, staff, settings</li>
          <li><strong>Therapist</strong> — can be booked for services</li>
          <li><strong>Receptionist</strong> — manages bookings but not as a therapist</li>
        </ul>
        <p className="mt-3"><strong>Branch assignment:</strong> Each staff member belongs to one branch. They&apos;ll only appear in that branch&apos;s bookings and schedule.</p>
        <p className="mt-3"><strong>Commission rate:</strong> The default percentage they earn on completed bookings. Can be overridden per-service.</p>
        <p className="mt-3"><strong>Color:</strong> Shows up in the calendar view to distinguish bookings.</p>
      </>
    ),
  },
  {
    id: "services",
    icon: Scissors,
    title: "Services",
    summary: "Your treatment catalog",
    content: (
      <>
        <p>Add everything you offer — massages, facials, body treatments, etc.</p>
        <p className="mt-3"><strong>Each service has:</strong></p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Name, description, duration (minutes), price</li>
          <li>Category (for grouping on the booking page)</li>
          <li>Optional commission rate override (otherwise uses staff default)</li>
        </ul>
        <p className="mt-3">Services are shared across all branches — customers at any location can book them.</p>
      </>
    ),
  },
  {
    id: "schedule",
    icon: CalendarClock,
    title: "Schedule",
    summary: "Business hours, shifts, and absences",
    content: (
      <>
        <p><strong>Business Hours tab:</strong> Set opening/closing times for each day of the week. Mark days as closed if you don&apos;t operate.</p>
        <p className="mt-3"><strong>Shifts tab:</strong> Create reusable shift templates (e.g., &quot;Morning 9–13&quot;, &quot;Afternoon 14–18&quot;). Assign each staff member to shifts per day of the week.</p>
        <p className="mt-3"><strong>Absences tab:</strong> Record leave, sick days, or absences. Staff with absences show as unavailable on the booking calendar.</p>
        <p className="mt-3">The public booking page only shows available time slots based on business hours and staff shifts.</p>
      </>
    ),
  },
  {
    id: "products",
    icon: Package,
    title: "Products & Sales",
    summary: "Retail inventory and sales",
    content: (
      <>
        <p><strong>Products tab:</strong> Add retail products (oils, creams, candles, etc.) with price, cost, stock, and low-stock threshold.</p>
        <p className="mt-3"><strong>Sales tab:</strong> Record walk-in purchases or sales to booked clients. Pick product, quantity, payment method, and optionally a client.</p>
        <p className="mt-3"><strong>Stock auto-decrements</strong> when you record a sale. You&apos;ll see a warning icon if a product drops below its low-stock threshold.</p>
        <p className="mt-3">Each branch has its own inventory.</p>
      </>
    ),
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments",
    summary: "Service payment tracking",
    content: (
      <>
        <p>All payments linked to bookings show up here — method (card, cash, PromptPay, etc.), status, amount, and date.</p>
        <p className="mt-3">Online deposits made via Airwallex are automatically recorded when the payment succeeds (via webhook).</p>
        <p className="mt-3">Stats at the top: month-to-date revenue, completed transactions, average transaction value, outstanding balance.</p>
      </>
    ),
  },
  {
    id: "commissions",
    icon: DollarSign,
    title: "Commissions",
    summary: "Staff earnings from completed bookings",
    content: (
      <>
        <p>Only <strong>completed</strong> bookings count toward commissions. Make sure to mark bookings as completed after each visit.</p>
        <p className="mt-3"><strong>Calculation:</strong></p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-2 font-mono text-xs">
          commission = service.price × (service_rate ?? staff_rate) / 100
        </div>
        <p className="mt-3">The service-specific rate takes precedence if set, otherwise it falls back to the staff member&apos;s default rate.</p>
        <p className="mt-3"><strong>Date filter presets:</strong> This Month, Last Month, Last 30 Days. Or pick custom dates.</p>
        <p className="mt-3">Click any staff row to expand and see the individual bookings contributing to their commission.</p>
      </>
    ),
  },
  {
    id: "reviews",
    icon: Star,
    title: "Reviews",
    summary: "Customer feedback system",
    content: (
      <>
        <p><strong>How it works:</strong></p>
        <ol className="list-decimal ml-5 space-y-1 mt-2">
          <li>You mark a booking as <em>Completed</em></li>
          <li>System automatically sends a review request to the client (email + LINE + WhatsApp if opted in)</li>
          <li>Client taps the link, rates 1–5 stars, optionally adds a comment</li>
          <li>Review appears in the Reviews dashboard</li>
        </ol>
        <p className="mt-3">Each booking can only be reviewed once. Reviews are automatically approved — you can hide them from the dashboard if needed.</p>
        <p className="mt-3">See your average rating, distribution, and full review list. Click a star bar to filter by rating.</p>
      </>
    ),
  },
  {
    id: "branches",
    icon: MapPin,
    title: "Branches",
    summary: "Multi-location management",
    content: (
      <>
        <p>If you have multiple spa locations, manage them all from one account.</p>
        <p className="mt-3"><strong>Each branch has:</strong> own address, phone, timezone, staff, schedule, bookings, and inventory.</p>
        <p className="mt-3"><strong>Shared across branches:</strong> services catalog, clients database, billing, notification settings.</p>
        <p className="mt-3"><strong>Branch switcher:</strong> Top of the sidebar. Switch to view bookings, staff, and schedule for a specific location.</p>
        <p className="mt-3"><strong>Location-specific booking links:</strong> Share a direct link to a branch with <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">?branch=BRANCH_ID</code> added to your booking URL.</p>
      </>
    ),
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analytics",
    summary: "Business performance insights",
    content: (
      <>
        <p>Real-time KPIs: today&apos;s bookings, month revenue, active clients, retention rate, new clients.</p>
        <p className="mt-3"><strong>Charts:</strong> revenue trend (6 months), bookings by day of week, service distribution.</p>
        <p className="mt-3"><strong>Top performers:</strong> best-selling services and top therapists.</p>
      </>
    ),
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    summary: "Email, LINE, and WhatsApp",
    content: (
      <>
        <p>SpaSoft can send automated notifications to clients via three channels:</p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li><strong>Email</strong> — always on, works for everyone</li>
          <li><strong>LINE</strong> — for Thai customers who add your LINE Official Account as friend</li>
          <li><strong>WhatsApp</strong> — for international customers who opt in during booking</li>
        </ul>
        <p className="mt-3"><strong>Events that trigger notifications:</strong></p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li>Booking confirmed — sent immediately</li>
          <li>Booking reminder — sent X hours before (configurable in Settings)</li>
          <li>Booking cancelled — sent immediately</li>
          <li>Review request — sent when booking is marked completed</li>
        </ul>
        <p className="mt-3">Configure credentials and reminder timing in <strong>Settings → Notifications</strong>.</p>
      </>
    ),
  },
  {
    id: "deposits",
    icon: CreditCard,
    title: "Booking Deposits",
    summary: "Reduce no-shows with upfront payment",
    content: (
      <>
        <p>Require clients to pay a deposit when booking online. This reduces no-shows.</p>
        <p className="mt-3"><strong>Setup:</strong> Go to <strong>Settings → Booking Deposits</strong>, toggle on, choose percentage (e.g. 30%) or fixed amount.</p>
        <p className="mt-3"><strong>How it works:</strong></p>
        <ol className="list-decimal ml-5 space-y-1 mt-2">
          <li>Client books through your public booking page</li>
          <li>Deposit amount is shown on the confirmation step</li>
          <li>Client pays via Airwallex drop-in (card or PromptPay)</li>
          <li>On successful payment, booking is confirmed and recorded in Payments</li>
        </ol>
        <p className="mt-3 text-amber-700 bg-amber-50 p-3 rounded-lg text-sm">
          💡 Deposits require Airwallex credentials to be configured in Vercel environment variables.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    icon: Receipt,
    title: "Billing & Subscription",
    summary: "Your SpaSoft subscription",
    content: (
      <>
        <p>Manage your own SpaSoft subscription here.</p>
        <p className="mt-3"><strong>Plans:</strong></p>
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li><strong>Starter</strong> — free, up to 50 bookings/mo, 1 staff</li>
          <li><strong>Professional</strong> — $49/mo, unlimited bookings, up to 10 staff, full features</li>
          <li><strong>Enterprise</strong> — $149/mo, unlimited staff, multi-location, custom integrations</li>
        </ul>
        <p className="mt-3">Payments are processed securely by Airwallex. You can cancel anytime from this page — you&apos;ll keep access until the end of your billing period.</p>
      </>
    ),
  },
  {
    id: "settings",
    icon: Settings,
    title: "Settings",
    summary: "Business profile, notifications, deposits",
    content: (
      <>
        <p><strong>Business Information:</strong> Name, email, phone, address.</p>
        <p className="mt-3"><strong>Preferences:</strong> Timezone (controls how times display everywhere), currency.</p>
        <p className="mt-3"><strong>Online Booking Page:</strong> Your public booking URL to share with customers.</p>
        <p className="mt-3"><strong>Booking Deposits:</strong> Enable upfront deposits via Airwallex.</p>
        <p className="mt-3"><strong>Notifications:</strong> Toggle email/LINE/WhatsApp, enter credentials, set reminder timing.</p>
      </>
    ),
  },
];

export default function HelpClient() {
  const [open, setOpen] = useState<string | null>("getting-started");

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-violet-600" />
          </div>
          <h1 className="text-2xl font-bold">How to Use SpaSoft</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Quick guides for every feature. Click any section to expand.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => {
          const isOpen = open === s.id;
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`bg-white rounded-xl border transition ${
                isOpen ? "border-violet-300 shadow-sm" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isOpen ? "bg-violet-100" : "bg-gray-100"
                }`}>
                  <Icon className={`h-5 w-5 ${isOpen ? "text-violet-600" : "text-gray-500"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.summary}</p>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-4 md:px-5 pb-5 pt-1 text-sm text-gray-700 leading-relaxed">
                  <div className="pl-14">{s.content}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-6 bg-violet-50 border border-violet-200 rounded-xl text-center">
        <Sparkles className="h-8 w-8 text-violet-600 mx-auto mb-2" />
        <p className="font-semibold text-violet-900">Need more help?</p>
        <p className="text-sm text-violet-700 mt-1">
          Reach out to support or check the documentation for advanced topics.
        </p>
      </div>
    </div>
  );
}
