import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PageHeader() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <Sparkles className="h-7 w-7 text-violet-600" />
        <span className="text-xl font-bold tracking-tight">SpaSoft</span>
      </Link>
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
  );
}
