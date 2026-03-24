import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Contact — SpaSoft",
  description: "Get in touch with the SpaSoft team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHeader />

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            Have a question, feedback, or need help getting started? We&apos;d
            love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <Mail className="h-6 w-6 text-violet-600 mb-3" />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-gray-600">For general inquiries and support</p>
            <a
              href="mailto:hello@spa-soft.com"
              className="text-sm text-violet-600 font-medium mt-2 inline-block hover:text-violet-700"
            >
              hello@spa-soft.com
            </a>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <MapPin className="h-6 w-6 text-violet-600 mb-3" />
            <h3 className="font-semibold mb-1">Company</h3>
            <p className="text-sm text-gray-600">
              50Best Limited
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <Clock className="h-6 w-6 text-violet-600 mb-3" />
            <h3 className="font-semibold mb-1">Support Hours</h3>
            <p className="text-sm text-gray-600">
              Monday — Friday
              <br />
              9:00 AM — 6:00 PM (ET)
            </p>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing</option>
                  <option>Feature Request</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <button
                type="submit"
                className="bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: "How do I get started?",
                  a: "Sign up for a free 14-day trial — no credit card required. You'll have access to all features immediately.",
                },
                {
                  q: "Can I import my existing client data?",
                  a: "Yes! You can import clients via CSV upload. Contact support and we'll help you get set up.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards through Stripe. Enterprise customers can also pay by invoice.",
                },
                {
                  q: "Is there a contract or commitment?",
                  a: "No. All plans are month-to-month. You can upgrade, downgrade, or cancel at any time.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-sm">{faq.q}</h3>
                  <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
