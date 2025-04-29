const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-center">Privacy Policy</h1>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p>
          This Privacy Policy explains how we collect, use, store, and protect
          your personal data when you use our hotel booking website. By
          accessing or using our services, you agree to this policy.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>a. Personal Information</strong>
            <ul className="list-inside space-y-1">
              <li>
                Name, contact details (email, phone number), date of birth.
              </li>
              <li>Government-issued ID (required for hotel check-in).</li>
              <li>Payment details (credit/debit card, UPI, wallet details).</li>
            </ul>
          </li>
          <li>
            <strong>b. Booking & Transaction Data</strong>
            <ul className="list-inside space-y-1">
              <li>
                Hotel preferences, check-in/check-out details, and past
                bookings.
              </li>
              <li>Transaction history and payment confirmations.</li>
            </ul>
          </li>
          <li>
            <strong>c. Device & Technical Information</strong>
            <ul className="list-inside space-y-1">
              <li>IP address, browser type, operating system.</li>
              <li>Cookies, location data (if enabled), and usage analytics.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
        <p>Your personal data is used for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Booking & Reservation Management – To confirm hotel reservations.
          </li>
          <li>Payment Processing – To facilitate secure transactions.</li>
          <li>Customer Support – To assist with inquiries and complaints.</li>
          <li>
            Marketing & Promotions – To send offers (with opt-out options).
          </li>
          <li>
            Website Optimization & Security – To enhance user experience and
            prevent fraud.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">4. Data Sharing & Disclosure</h2>
        <p>
          We do not sell or trade your personal data. However, we may share it
          with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hotels & Service Providers – To confirm bookings.</li>
          <li>Payment Gateways & Banks – For secure transactions.</li>
          <li>
            Government & Law Enforcement – If legally required under Indian
            laws.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">5. Data Storage & Security</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We use encryption and secure servers to protect your data.</li>
          <li>
            Access controls and firewalls are in place to prevent unauthorized
            access.
          </li>
          <li>Payment transactions are PCI-DSS compliant.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          6. Cookies & Tracking Technologies
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Cookies are used to enhance user experience and analyze website
            traffic.
          </li>
          <li>You can manage or disable cookies through browser settings.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          7. User Rights (As per DPDP Act, 2023)
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Access & Correct Data – Update or modify your personal information.
          </li>
          <li>Withdraw Consent – Opt out of marketing communications.</li>
          <li>
            Data Deletion – Request deletion of personal data (subject to legal
            requirements).
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">8. Data Retention Policy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Your data is retained only as long as necessary for booking
            services, legal compliance, or security purposes.
          </li>
          <li>
            Financial transactions may be stored for tax and regulatory
            compliance.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          9. Third-Party Links & External Services
        </h2>
        <p>
          Our website may contain links to third-party sites, which have their
          own privacy policies. We do not control or take responsibility for
          their data practices.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">10. Children's Privacy</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Our services are intended for individuals aged 18 and above.</li>
          <li>We do not knowingly collect data from minors.</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">11. Policy Updates</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>We may update this Privacy Policy from time to time.</li>
          <li>
            Significant changes will be notified via email or website
            announcements.
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">12. Contact Us</h2>
        <p>For privacy-related queries or requests, contact us at:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            📧 Email:{" "}
            <a
              href="mailto:support@brijdivinestay.com"
              className="text-blue-500"
            >
              support@brijdivinestay.com
            </a>
          </li>
          <li>📞 Customer Support: +91-9258 01 02 00</li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
