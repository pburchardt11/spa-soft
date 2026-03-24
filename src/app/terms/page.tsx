import PageHeader from "@/components/page-header";
import PageFooter from "@/components/page-footer";

export const metadata = {
  title: "Terms of Service — SpaSoft",
  description: "SpaSoft Terms of Service by 50Best Limited.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <PageHeader />

      <article className="max-w-3xl mx-auto px-6 pt-16 pb-16">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: March 24, 2026
        </p>

        <div className="mt-8 prose prose-gray max-w-none space-y-6 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              1. Introduction
            </h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of SpaSoft
              (&quot;the Service&quot;), a spa management software platform operated by
              50Best Limited (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), a company registered in
              accordance with applicable law.
            </p>
            <p className="mt-2">
              By creating an account or using SpaSoft, you agree to be bound by
              these Terms. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              2. Account Registration
            </h2>
            <p>
              To use SpaSoft, you must create an account with accurate and
              complete information. You are responsible for maintaining the
              security of your account credentials and for all activity that
              occurs under your account. You must notify us immediately of any
              unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              3. Use of the Service
            </h2>
            <p>
              SpaSoft provides tools for spa and wellness business management,
              including booking, client management, payment processing, and
              analytics. You agree to use the Service only for lawful purposes
              and in accordance with these Terms.
            </p>
            <p className="mt-2">You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Upload malicious code or content</li>
              <li>Resell or redistribute the Service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              4. Subscriptions and Billing
            </h2>
            <p>
              SpaSoft offers free and paid subscription plans. Paid plans are
              billed monthly or annually as selected during signup. All fees are
              non-refundable except as required by applicable law.
            </p>
            <p className="mt-2">
              We reserve the right to change pricing with 30 days&apos; notice.
              Continued use after a price change constitutes acceptance of the
              new pricing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              5. Data and Privacy
            </h2>
            <p>
              Your data belongs to you. We process your data solely to provide
              the Service. We will not sell your data to third parties. Our
              handling of personal data is governed by our Privacy Policy.
            </p>
            <p className="mt-2">
              You are responsible for ensuring that your use of SpaSoft complies
              with applicable data protection laws, including obtaining
              necessary consent from your clients for data collection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              6. Payment Processing
            </h2>
            <p>
              Payment processing is provided through third-party payment
              processors (such as Stripe). Your use of payment features is
              subject to the payment processor&apos;s terms of service. 50Best
              Limited is not responsible for payment processing errors caused by
              third-party providers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              7. Intellectual Property
            </h2>
            <p>
              SpaSoft, including its design, code, features, and branding, is
              the intellectual property of 50Best Limited. You may not copy,
              modify, or reverse-engineer any part of the Service.
            </p>
            <p className="mt-2">
              Content you create or upload through SpaSoft remains your
              property. By using the Service, you grant us a limited license to
              store and process your content solely to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              8. Service Availability
            </h2>
            <p>
              We strive to maintain 99.9% uptime but do not guarantee
              uninterrupted access. We may perform scheduled maintenance with
              advance notice. We are not liable for downtime caused by
              circumstances beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              9. Termination
            </h2>
            <p>
              You may cancel your account at any time. Upon cancellation, your
              data will be retained for 30 days and then permanently deleted.
              We may suspend or terminate your account if you violate these
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              10. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, 50Best Limited shall not
              be liable for any indirect, incidental, special, or consequential
              damages arising from your use of the Service. Our total liability
              shall not exceed the amount you paid us in the 12 months
              preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              11. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you
              of material changes via email or through the Service. Continued
              use after changes take effect constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">
              12. Contact
            </h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p className="mt-2">
              <strong>50Best Limited</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:legal@spa-soft.com"
                className="text-violet-600 hover:text-violet-700"
              >
                legal@spa-soft.com
              </a>
            </p>
          </section>
        </div>
      </article>

      <PageFooter />
    </div>
  );
}
