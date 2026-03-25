import Link from "next/link";
import { Scissors, UserCog, Calendar, ArrowRight, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Welcome — SpaSoft",
};

export default function WelcomePage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="text-center mb-10 mt-4">
        <h1 className="text-3xl font-bold">Welcome to SpaSoft!</h1>
        <p className="text-gray-500 mt-2">
          Let&apos;s get your spa set up in 3 easy steps.
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/dashboard/services"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition group"
        >
          <div className="h-12 w-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
            <Scissors className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Step 1: Add your services</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Add the treatments and services you offer — massages, facials, body wraps, etc. Set the duration and price for each.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition shrink-0" />
        </Link>

        <Link
          href="/dashboard/staff"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition group"
        >
          <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <UserCog className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Step 2: Add your staff</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Add your therapists and team members. You can assign them roles and colors for the calendar view.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition shrink-0" />
        </Link>

        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition group"
        >
          <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Step 3: Start booking</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Create your first booking, or share your online booking page with clients so they can book themselves.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-violet-600 transition shrink-0" />
        </Link>
      </div>

      <div className="mt-8 bg-violet-50 border border-violet-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-violet-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Your account is ready</p>
            <p className="text-sm text-gray-600 mt-1">
              You can always come back to this setup from the Dashboard. Skip any step and do it later — SpaSoft works even with just one service added.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="text-sm text-violet-600 hover:text-violet-700 font-medium"
        >
          Skip setup and go to Dashboard
        </Link>
      </div>
    </div>
  );
}
