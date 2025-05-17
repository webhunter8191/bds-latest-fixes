import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <div className="h-1 w-24 bg-[#6A5631] mx-auto my-4 rounded-full"></div>
          <p className="text-gray-500 mb-2">Last Updated: June 1, 2023</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This Privacy Policy explains how we collect, use, store, and protect
            your personal data when you use our hotel booking website.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-12">
          <PolicySection title="1. Introduction">
            <p>
              By accessing or using our services, you agree to this policy. We
              respect your privacy and are committed to protecting your personal
              information.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p className="mb-4">
              We collect the following types of information:
            </p>
            <div className="space-y-4">
              <div className="pl-4 border-l-4 border-[#6A5631]/30">
                <h4 className="font-semibold text-gray-800">
                  Personal Information
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    Name, contact details (email, phone number), date of birth.
                  </li>
                  <li>Government-issued ID (required for hotel check-in).</li>
                  <li>
                    Payment details (credit/debit card, UPI, wallet details).
                  </li>
                </ul>
              </div>

              <div className="pl-4 border-l-4 border-[#6A5631]/30">
                <h4 className="font-semibold text-gray-800">
                  Booking & Transaction Data
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>
                    Hotel preferences, check-in/check-out details, and past
                    bookings.
                  </li>
                  <li>Transaction history and payment confirmations.</li>
                </ul>
              </div>

              <div className="pl-4 border-l-4 border-[#6A5631]/30">
                <h4 className="font-semibold text-gray-800">
                  Device & Technical Information
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>IP address, browser type, operating system.</li>
                  <li>
                    Cookies, location data (if enabled), and usage analytics.
                  </li>
                </ul>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="3. How We Use Your Data">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <span className="font-medium text-gray-800">
                  Booking & Reservation Management
                </span>{" "}
                – To confirm hotel reservations.
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Payment Processing
                </span>{" "}
                – To facilitate secure transactions.
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Customer Support
                </span>{" "}
                – To assist with inquiries and complaints.
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Marketing & Promotions
                </span>{" "}
                – To send offers (with opt-out options).
              </li>
              <li>
                <span className="font-medium text-gray-800">
                  Website Optimization & Security
                </span>{" "}
                – To enhance user experience and prevent fraud.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Data Sharing & Disclosure">
            <p className="mb-4">
              We do not sell or trade your personal data. However, we may share
              it with:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Hotels & Service Providers – To confirm bookings.</li>
              <li>Payment Gateways & Banks – For secure transactions.</li>
              <li>
                Government & Law Enforcement – If legally required under Indian
                laws.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Data Storage & Security">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                We use encryption and secure servers to protect your data.
              </li>
              <li>
                Access controls and firewalls are in place to prevent
                unauthorized access.
              </li>
              <li>Payment transactions are PCI-DSS compliant.</li>
            </ul>
          </PolicySection>

          <PolicySection title="6. Cookies & Tracking Technologies">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                Cookies are used to enhance user experience and analyze website
                traffic.
              </li>
              <li>
                You can manage or disable cookies through browser settings.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="7. User Rights (As per DPDP Act, 2023)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#6A5631]/5 p-4 rounded-lg border border-[#6A5631]/20">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Access & Correct Data
                </h4>
                <p className="text-gray-600 text-sm">
                  Update or modify your personal information anytime.
                </p>
              </div>
              <div className="bg-[#6A5631]/5 p-4 rounded-lg border border-[#6A5631]/20">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Withdraw Consent
                </h4>
                <p className="text-gray-600 text-sm">
                  Opt out of marketing communications at your discretion.
                </p>
              </div>
              <div className="bg-[#6A5631]/5 p-4 rounded-lg border border-[#6A5631]/20">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Data Deletion
                </h4>
                <p className="text-gray-600 text-sm">
                  Request deletion of personal data (subject to legal
                  requirements).
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="8. Data Retention Policy">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                Your data is retained only as long as necessary for booking
                services, legal compliance, or security purposes.
              </li>
              <li>
                Financial transactions may be stored for tax and regulatory
                compliance.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="9. Third-Party Links & External Services">
            <p className="text-gray-600">
              Our website may contain links to third-party sites, which have
              their own privacy policies. We do not control or take
              responsibility for their data practices.
            </p>
          </PolicySection>

          <PolicySection title="10. Children's Privacy">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                Our services are intended for individuals aged 18 and above.
              </li>
              <li>We do not knowingly collect data from minors.</li>
            </ul>
          </PolicySection>

          <PolicySection title="11. Policy Updates">
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>We may update this Privacy Policy from time to time.</li>
              <li>
                Significant changes will be notified via email or website
                announcements.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="12. Contact Us" isLast={true}>
            <div className="bg-[#6A5631]/5 border border-[#6A5631]/20 rounded-lg p-6 text-center">
              <p className="font-semibold text-gray-800 mb-4">
                For privacy-related queries or requests, contact us at:
              </p>
              <div className="space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <span>📧</span>
                  <a
                    href="mailto:support@brijdivinestay.com"
                    className="text-[#6A5631] hover:underline"
                  >
                    support@brijdivinestay.com
                  </a>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>📞</span>
                  <span>Customer Support: +91-9258 01 02 00</span>
                </p>
              </div>
            </div>
          </PolicySection>
        </div>
      </div>
    </div>
  );
};

const PolicySection = ({
  title,
  children,
  isLast = false,
}: {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <div className={`${isLast ? "" : "mb-8 pb-8 border-b border-gray-100"}`}>
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <div className="w-1 h-5 bg-[#6A5631] rounded-full mr-2"></div>
      {title}
    </h2>
    <div className="text-gray-600 pl-3">{children}</div>
  </div>
);

export default PrivacyPolicy;
