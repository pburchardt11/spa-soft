import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PageFooter() {
  return (
    <footer className="border-t border-gray-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <span className="font-semibold">SpaSoft</span>
            </div>
            <p className="text-sm text-gray-500">
              Spa management software by 50Best Limited.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <div className="space-y-2">
              <Link href="/#features" className="block text-sm text-gray-500 hover:text-gray-900">Features</Link>
              <Link href="/#pricing" className="block text-sm text-gray-500 hover:text-gray-900">Pricing</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-gray-500 hover:text-gray-900">About</Link>
              <Link href="/contact" className="block text-sm text-gray-500 hover:text-gray-900">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <div className="space-y-2">
              <Link href="/terms" className="block text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} 50Best Limited. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            SpaSoft is a product of 50Best Limited.
          </p>
        </div>
      </div>
    </footer>
  );
}
