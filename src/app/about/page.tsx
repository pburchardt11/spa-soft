import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";
import { Users, Target, Heart } from "lucide-react";

export const metadata = {
  title: "About — SpaSoft",
  description: "Learn about SpaSoft and 50Best Limited.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHeader />

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl font-bold">About SpaSoft</h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          SpaSoft is built by <strong>50Best Limited</strong>, a company
          dedicated to creating modern software solutions for the hospitality
          and wellness industry. We believe spa owners should spend their time
          delighting clients — not wrestling with spreadsheets and disconnected
          tools.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <Target className="h-8 w-8 text-violet-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To give every spa — from solo practitioners to multi-location
              businesses — the tools they need to run efficiently, grow
              confidently, and deliver exceptional client experiences.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <Heart className="h-8 w-8 text-violet-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Why We Built This</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We saw spa owners juggling paper calendars, separate payment
              systems, and manual client records. SpaSoft brings everything
              into one place — booking, CRM, payments, and analytics.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <Users className="h-8 w-8 text-violet-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">50Best Limited</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              50Best Limited is a technology company focused on building
              best-in-class software for hospitality businesses. SpaSoft is
              part of our growing portfolio of industry-specific solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
            {[
              {
                title: "Simplicity first",
                desc: "Software should save you time, not create more work. Every feature we build must be intuitive enough to use without a manual.",
              },
              {
                title: "Built for spa professionals",
                desc: "We design for the real workflows of spa owners, therapists, and receptionists — not generic business users.",
              },
              {
                title: "Data you can trust",
                desc: "Your business data is encrypted, backed up, and never shared. We take security and privacy seriously.",
              },
              {
                title: "Always improving",
                desc: "We listen to our customers and ship improvements every week. Your feedback directly shapes our roadmap.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}
