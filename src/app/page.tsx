import Link from "next/link";
import Image from "next/image";
import DemoButton from "@/components/demo-button";
import {
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  MapPin,
  Star,
  Package,
  DollarSign,
  Bell,
  Receipt,
  Smartphone,
  Globe,
  CheckCircle2,
  Play,
  Zap,
  TrendingUp,
  Heart,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Online Booking",
    desc: "24/7 booking page with real-time availability, branch selection, and mobile-optimized flow. Customers book in under 60 seconds.",
  },
  {
    icon: Users,
    title: "Client CRM",
    desc: "Complete customer profiles with visit history, tags (VIP, Regular), spend tracking, and smart segmentation for marketing.",
  },
  {
    icon: DollarSign,
    title: "Deposit Collection",
    desc: "Reduce no-shows by requiring upfront deposits. Accept cards and PromptPay via Airwallex — set a percentage or fixed amount.",
  },
  {
    icon: Bell,
    title: "Multi-Channel Notifications",
    desc: "Automated confirmations, reminders, and review requests via Email, LINE, and WhatsApp. Clients choose their preferred channel.",
  },
  {
    icon: Clock,
    title: "Staff Scheduling",
    desc: "Manage shifts, time-off, and absences. Public booking shows only real availability based on staff schedules and business hours.",
  },
  {
    icon: MapPin,
    title: "Multi-Branch Support",
    desc: "Manage multiple spa locations from one account. Each branch has its own staff, inventory, schedule, and booking link.",
  },
  {
    icon: Star,
    title: "Customer Reviews",
    desc: "Automatically request reviews after each visit. Build social proof with star ratings and comments — track everything in one dashboard.",
  },
  {
    icon: Package,
    title: "Retail & Inventory",
    desc: "Sell oils, creams, and other retail products. Auto-decrement stock on sale with low-stock alerts. Full sales history and revenue tracking.",
  },
  {
    icon: TrendingUp,
    title: "Staff Commissions",
    desc: "Track therapist earnings automatically. Set per-staff rates with optional per-service overrides. Detailed breakdown per booking.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    desc: "Real-time dashboards: revenue trends, bookings by day, top services, therapist performance, client retention, and more.",
  },
  {
    icon: CreditCard,
    title: "Unified Payments",
    desc: "Track all payments in one place — online deposits, cash, card, Apple Pay, Google Pay, PromptPay. Full reporting and reconciliation.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Bank-grade encryption, 99.9% uptime, daily backups. Multi-tenant with row-level security — your data is isolated and protected.",
  },
];

const stats = [
  { label: "Features built-in", value: "25+" },
  { label: "Channels", value: "3" },
  { label: "Languages", value: "15+" },
  { label: "Uptime", value: "99.9%" },
];

const testimonials = [
  {
    quote:
      "SpaSoft replaced three separate tools we were using. Our no-shows dropped by 60% after enabling deposits, and LINE reminders are a game-changer for our Thai customers.",
    author: "Siriporn K.",
    role: "Owner, Serenity Spa Bangkok",
  },
  {
    quote:
      "The multi-branch support is exactly what we needed. I can switch between my three locations in seconds and see exactly what's happening at each one.",
    author: "Michael T.",
    role: "Founder, Wellness Collective",
  },
  {
    quote:
      "Setting up was so simple. Within an hour we had our services, staff, and booking page live. Our therapists love seeing their commissions in real-time.",
    author: "Anna R.",
    role: "Manager, Pure Escape Spa",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-violet-600" />
            <span className="text-xl font-bold tracking-tight">SpaSoft</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
            <a href="#demo" className="hover:text-gray-900 transition">Demo</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2000&q=80"
            alt="Spa atmosphere"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/95 via-white/90 to-purple-50/95" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 md:px-6 pt-16 md:pt-24 pb-20 md:pb-28">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full border border-violet-200">
            <Zap className="h-3.5 w-3.5" />
            All-in-one spa management platform
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Run your spa like
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              a modern business
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Booking, CRM, payments, inventory, reviews, and analytics — everything in one beautiful platform.
            Delight your clients and save hours every week.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-violet-700 transition text-base shadow-lg shadow-violet-600/20"
            >
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <DemoButton />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
              <p className="text-sm text-violet-100 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo video section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            See SpaSoft in 90 seconds
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Watch a quick tour of the platform and see how it can transform your spa operations.
          </p>

          {/* Video placeholder / embed */}
          <div className="mt-10 relative group cursor-pointer">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gradient-to-br from-violet-600 to-purple-700">
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&q=80"
                alt="SpaSoft demo preview"
                fill
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 md:h-24 md:w-24 bg-white/95 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-violet-600 ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-left">
                <p className="text-white font-semibold text-lg md:text-xl">Full Product Tour</p>
                <p className="text-white/80 text-sm mt-1">Bookings · CRM · Payments · Analytics</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No time? <Link href="/signup" className="text-violet-600 font-medium hover:underline">Start a free trial</Link> and explore at your own pace.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to run your spa
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Replace spreadsheets, paper calendars, and a dozen disconnected tools with one powerful platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-600 transition-colors">
                  <f.icon className="h-6 w-6 text-violet-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Up and running in under an hour
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              No technical knowledge required. If you can use email, you can use SpaSoft.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Sign up",
                desc: "Create your account in 30 seconds. No credit card needed. Start with a free 14-day trial.",
              },
              {
                step: "02",
                icon: Clock,
                title: "Add your services & staff",
                desc: "Set your treatment menu, prices, therapist team, and opening hours. Takes about 15 minutes.",
              },
              {
                step: "03",
                icon: Heart,
                title: "Share your booking link",
                desc: "Post your public booking page on social media, website, or LINE. Customers can book instantly.",
              },
            ].map((s) => (
              <div key={s.step} className="relative bg-white p-8 rounded-2xl border border-gray-200">
                <div className="text-5xl font-bold text-violet-100 absolute top-6 right-6">{s.step}</div>
                <div className="h-12 w-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 relative">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg relative">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed relative">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature showcase: dashboard preview */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
                The Dashboard
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Everything at a glance
              </h2>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                Your personal command center. See today&apos;s bookings, revenue, client activity, and staff performance in real-time.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Today's bookings and upcoming appointments",
                  "Revenue trends and MTD totals",
                  "Client retention and new signups",
                  "Top services and therapist performance",
                  "Low-stock alerts and pending reviews",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-violet-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center gap-2 text-violet-600 font-semibold hover:gap-3 transition-all"
              >
                Start exploring <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 blur-3xl -z-10" />
              <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 h-3" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-gray-400">Good morning</p>
                      <p className="font-bold text-lg">Your Spa Dashboard</p>
                    </div>
                    <Sparkles className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "Today's Bookings", val: "12", color: "bg-violet-50 text-violet-700" },
                      { label: "Revenue (MTD)", val: "฿142,800", color: "bg-green-50 text-green-700" },
                      { label: "Active Clients", val: "348", color: "bg-blue-50 text-blue-700" },
                      { label: "Avg Rating", val: "4.9 ★", color: "bg-amber-50 text-amber-700" },
                    ].map((s) => (
                      <div key={s.label} className={`p-4 rounded-xl ${s.color}`}>
                        <p className="text-xs opacity-80">{s.label}</p>
                        <p className="text-2xl font-bold mt-1">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Upcoming today</p>
                    {[
                      { time: "10:00", name: "Sarah Chen", service: "Hot Stone Therapy", staff: "Emma" },
                      { time: "11:30", name: "Michael L.", service: "Deep Tissue Massage", staff: "Olivia" },
                      { time: "14:00", name: "Jessica W.", service: "Facial Treatment", staff: "Sophie" },
                    ].map((b, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs font-bold text-violet-600 w-12">{b.time}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{b.name}</p>
                          <p className="text-xs text-gray-500 truncate">{b.service} · {b.staff}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile booking highlight */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Phone mockup */}
            <div className="relative order-2 lg:order-1">
              <div className="max-w-sm mx-auto">
                <div className="relative aspect-[9/19] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10" />
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    <Image
                      src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80"
                      alt="Mobile booking"
                      fill
                      sizes="400px"
                      className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex flex-col p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-violet-600" />
                        <span className="font-bold text-sm">Serenity Spa</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i === 1 ? "bg-violet-600" : "bg-gray-200"}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">Step 1 of 3</p>
                      </div>
                      <p className="font-bold text-base mb-3">Choose a Service</p>
                      <div className="space-y-2">
                        {[
                          { name: "Deep Tissue Massage", price: "฿1,200", dur: "60 min" },
                          { name: "Hot Stone Therapy", price: "฿1,500", dur: "90 min" },
                          { name: "Facial Treatment", price: "฿850", dur: "45 min" },
                        ].map((s) => (
                          <div key={s.name} className="p-3 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-sm">{s.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{s.dur}</p>
                              </div>
                              <p className="text-violet-600 font-bold text-sm">{s.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
                Mobile-First Booking
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Your customers book from their phones
              </h2>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                Every SpaSoft account comes with a beautiful, mobile-optimized public booking page.
                Share the link on LINE, Facebook, Instagram, or WhatsApp — customers book in 3 easy steps.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Smartphone, title: "Mobile optimized", desc: "Fast, clean, and easy to use on any phone" },
                  { icon: Globe, title: "24/7 availability", desc: "Clients book anytime, even at 2am" },
                  { icon: MessageCircle, title: "LINE & WhatsApp", desc: "Notifications on their favorite app" },
                  { icon: CreditCard, title: "Deposit collection", desc: "Reduce no-shows with upfront payment" },
                ].map((item) => (
                  <div key={item.title} className="bg-white p-4 rounded-xl border border-gray-200">
                    <item.icon className="h-5 w-5 text-violet-600 mb-2" />
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              Loved by spa owners
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What our customers say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-semibold text-sm">{t.author}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block mb-3 px-3 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Start free. Upgrade when you&apos;re ready. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "For solo practitioners",
                items: [
                  "Up to 50 bookings/mo",
                  "1 staff member",
                  "Public booking page",
                  "Basic analytics",
                  "Email notifications",
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
                  "LINE & WhatsApp notifications",
                  "Deposit collection",
                  "Customer reviews",
                  "Inventory & retail sales",
                  "Commission tracking",
                  "Priority support",
                ],
                featured: true,
              },
              {
                name: "Enterprise",
                price: "$149",
                desc: "For multi-location spas",
                items: [
                  "Everything in Professional",
                  "Unlimited staff",
                  "Multi-branch support",
                  "Advanced analytics",
                  "Custom integrations",
                  "Dedicated account manager",
                  "Custom onboarding",
                  "SLA guarantee",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col bg-white ${
                  "featured" in plan && plan.featured
                    ? "border-violet-600 ring-4 ring-violet-100 shadow-xl md:-mt-4 md:mb-4"
                    : "border-gray-200"
                }`}
              >
                {"featured" in plan && plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-bold text-xl">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                <p className="mt-4 text-4xl font-bold">
                  {plan.price}
                  {plan.price !== "Free" && (
                    <span className="text-base font-normal text-gray-500">/mo</span>
                  )}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.items.map((item) => (
                    <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-8 block text-center py-3 rounded-lg font-semibold text-sm transition ${
                    "featured" in plan && plan.featured
                      ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20"
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

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 p-10 md:p-16 text-center text-white">
            <div className="absolute inset-0 opacity-20">
              <Image
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to transform your spa?
              </h2>
              <p className="mt-4 text-lg text-violet-100 max-w-xl mx-auto">
                Join hundreds of spa owners who&apos;ve modernized their business with SpaSoft.
                Try it free for 14 days — no credit card required.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 font-semibold px-7 py-3.5 rounded-lg hover:bg-violet-50 transition text-base shadow-xl"
                >
                  Start your free trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition text-base"
                >
                  Talk to sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-6 w-6 text-violet-600" />
                <span className="font-bold text-lg">SpaSoft</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                The all-in-one spa management platform. Run your spa like a modern business.
              </p>
              <p className="text-xs text-gray-400 mt-4">By 50Best Limited</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-gray-500 hover:text-violet-600 transition">Features</a>
                <a href="#pricing" className="block text-sm text-gray-500 hover:text-violet-600 transition">Pricing</a>
                <a href="#demo" className="block text-sm text-gray-500 hover:text-violet-600 transition">Demo</a>
                <Link href="/book" className="block text-sm text-gray-500 hover:text-violet-600 transition">Booking Page</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-gray-500 hover:text-violet-600 transition">About</Link>
                <Link href="/contact" className="block text-sm text-gray-500 hover:text-violet-600 transition">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <div className="space-y-2">
                <Link href="/terms" className="block text-sm text-gray-500 hover:text-violet-600 transition">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} 50Best Limited. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Built with ❤ for spa owners worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
