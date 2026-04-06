"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  UserCog,
  Scissors,
  ExternalLink,
  Menu,
  X,
  CalendarClock,
  Receipt,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { setCurrentBranch } from "@/lib/actions/branches";
import type { Branch } from "@/lib/types";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/staff", label: "Staff", icon: UserCog },
  { href: "/dashboard/services", label: "Services", icon: Scissors },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/dashboard/branches", label: "Branches", icon: MapPin },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: Receipt },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  businessName,
  userEmail,
  branches = [],
  currentBranchId,
}: {
  businessName?: string;
  userEmail?: string;
  branches?: Branch[];
  currentBranchId?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);

  const currentBranch = branches.find((b) => b.id === currentBranchId) || branches[0];

  async function handleSwitchBranch(branchId: string) {
    await setCurrentBranch(branchId);
    setBranchMenuOpen(false);
    window.location.reload();
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-400" />
          <span className="text-lg font-bold tracking-tight">SpaSoft</span>
        </div>
        <button onClick={() => setOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Branch Switcher */}
      {branches.length > 0 && (
        <div className="px-3 pt-3 relative">
          <button
            onClick={() => setBranchMenuOpen(!branchMenuOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-sm transition"
          >
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-violet-400 shrink-0" />
              <span className="truncate">{currentBranch?.name || "Select branch"}</span>
            </div>
            {branches.length > 1 && <ChevronDown className={`h-4 w-4 shrink-0 transition ${branchMenuOpen ? "rotate-180" : ""}`} />}
          </button>
          {branchMenuOpen && branches.length > 1 && (
            <div className="absolute left-3 right-3 mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleSwitchBranch(branch.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition ${
                    branch.id === currentBranchId
                      ? "bg-violet-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}

        <div className="mt-4 pt-4 border-t border-gray-800">
          <a
            href="/book"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <ExternalLink className="h-4.5 w-4.5" />
            Booking Page
          </a>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold shrink-0">
            {(businessName || "S")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{businessName || "My Spa"}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail || ""}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 mt-1 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition w-full"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-950 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <span className="font-bold">SpaSoft</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-1">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar - desktop: always visible, mobile: slide in */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-950 text-white flex flex-col min-h-screen transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
