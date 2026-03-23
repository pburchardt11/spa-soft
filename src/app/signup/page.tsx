import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-7 w-7 text-violet-600" />
            <span className="text-xl font-bold">SpaSoft</span>
          </div>
          <h1 className="text-2xl font-bold">Start your free trial</h1>
          <p className="text-sm text-gray-500 mt-1">
            14 days free. No credit card required.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                placeholder="Your spa name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@yourspa.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <Link
              href="/dashboard"
              className="w-full block text-center bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
            >
              Create account
            </Link>
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
