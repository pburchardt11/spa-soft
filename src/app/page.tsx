import Link from "next/link";
import {
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Booking",
    desc: "Online booking with real-time availability. Automated reminders reduce no-shows by up to 40%.",
  },
  {
    icon: Users,
    title: "Client CRM",
    desc: "Complete client profiles with visit history, preferences, notes, and loyalty tracking.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    desc: "Accept payments in-store and online. Track revenue, refunds, and outstanding balances.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Real-time dashboards for revenue, bookings, staff performance, and client retention.",
  },
  {
    icon: Clock,
    title: "Staff Scheduling",
    desc: "Manage therapist schedules, breaks, and time-off in one calendar view.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with 99.9% uptime. Your data is encrypted and backed up daily.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-violet-600" />
          <span className="text-xl font-bold tracking-tight">SpaSoft</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900">
            Features
          </a>
          <a href="#pricing" className="hover:text-gray-900">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16">
        <div className="inline-block mb-4 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
          Now in public beta
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Run your spa like
          <br />
          <span className="text-violet-600">a modern business</span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Booking, CRM, payments, and analytics — finally in one place. SpaSoft
          gives you everything you need to grow your spa business, delight
          clients, and save hours every week.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-violet-700 transition text-base"
          >
            Get started free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition text-base"
          >
            View demo
          </Link>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          No credit card required &middot; 14-day free trial
        </p>
      </section>

      {/* Dashboard preview */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
          <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 h-48 flex items-center justify-center">
              <p className="text-white/80 text-lg font-medium">
                Dashboard Preview
              </p>
            </div>
            <div className="grid grid-cols-4 gap-4 p-6">
              {[
                { label: "Today's Bookings", val: "12" },
                { label: "Revenue (MTD)", val: "$14,280" },
                { label: "Active Clients", val: "348" },
                { label: "Avg. Rating", val: "4.9" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-4 rounded-lg bg-gray-50"
                >
                  <p className="text-2xl font-bold">{s.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">
            Everything you need to manage your spa
          </h2>
          <p className="mt-3 text-gray-600 text-center max-w-xl mx-auto">
            Replace spreadsheets, paper calendars, and disconnected tools with
            one powerful platform.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <f.icon className="h-8 w-8 text-violet-600 mb-4" />
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-gray-600 text-center">
            Start free. Upgrade when you&apos;re ready.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "For solo practitioners",
                items: [
                  "Up to 50 bookings/mo",
                  "1 staff member",
                  "Basic analytics",
                  "Email support",
                ],
              },
              {
                name: "Professional",
                price: "$49",
                desc: "For growing spas",
                items: [
                  "Unlimited bookings",
                  "Up to 10 staff",
                  "Full CRM & analytics",
                  "Payment processing",
                  "Priority support",
                ],
                featured: true,
              },
              {
                name: "Enterprise",
                price: "$149",
                desc: "For multi-location spas",
                items: [
                  "Everything in Pro",
                  "Unlimited staff",
                  "Multi-location",
                  "Custom integrations",
                  "Dedicated account manager",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  "featured" in plan && plan.featured
                    ? "border-violet-600 ring-2 ring-violet-600"
                    : "border-gray-200"
                }`}
              >
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.desc}</p>
                <p className="mt-4 text-4xl font-bold">
                  {plan.price}
                  {plan.price !== "Free" && (
                    <span className="text-base font-normal text-gray-500">
                      /mo
                    </span>
                  )}
                </p>
                <ul className="mt-6 space-y-2 flex-1">
                  {plan.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-violet-600 mt-0.5">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-6 block text-center py-2.5 rounded-lg font-medium text-sm transition ${
                    "featured" in plan && plan.featured
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-600" />
            <span className="font-semibold">SpaSoft</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} SpaSoft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
