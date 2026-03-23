import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-7 w-7 text-violet-600" />
            <span className="text-xl font-bold">SpaSoft</span>
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Log in to your SpaSoft account
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form className="space-y-4">
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
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-gray-300 text-violet-600"
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-violet-600 hover:text-violet-700">
                Forgot password?
              </a>
            </div>
            <Link
              href="/dashboard"
              className="w-full block text-center bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
            >
              Log in
            </Link>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-violet-600 hover:text-violet-700 font-medium"
          >
            Start free trial
          </Link>
        </p>
      </div>
    </div>
  );
}
