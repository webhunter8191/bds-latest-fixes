import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Terms and Conditions
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Effective Date: 1 June 2025 | Last Updated: 1 June 2025
      </p>

      <p>
        Welcome to Brij Divine Stay. By accessing or using our website and
        services, you agree to comply with and be bound by the following Terms
        and Conditions. Please read them carefully before using our website.
      </p>

      <Section title="1. Acceptance of Terms">
        By using Brij Divine Stay, you agree to be legally bound by these Terms
        and Conditions, our Privacy Policy, and any additional guidelines or
        rules applicable to specific services.
      </Section>

      <Section title="2. Booking Policy">
        <ul className="list-disc list-inside">
          <li>All bookings are subject to availability and confirmation.</li>
          <li>Guests must provide accurate personal details during booking.</li>
          <li>
            Valid ID proof (Aadhaar, Passport, etc.) must be shown at check-in.
          </li>
        </ul>
      </Section>

      <Section title="3. Payment and Pricing">
        <ul className="list-disc list-inside">
          <li>
            Prices are in INR and include applicable taxes unless stated
            otherwise.
          </li>
          <li>Full payment is required unless "pay at hotel" is specified.</li>
          <li>Prices may change without prior notice.</li>
        </ul>
      </Section>

      <Section title="4. Cancellation and Refund Policy">
        <ul className="list-disc list-inside">
          <li>Cancel via website or contact support.</li>
          <li>
            Refunds depend on the room’s cancellation policy shown at booking.
          </li>
          <li>
            <strong>If full payment is made:</strong>
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>
                If a customer cancels at least 12 hours before the scheduled
                check-in time or before 12:00 AM on the check-in date, they are
                eligible for a 100% refund.
              </li>
              <li>
                If a customer cancels less than 12 hours before check-in, after
                12:00 AM on the check-in date, or fails to show up (no-show), no
                refund will be issued.
              </li>
            </ul>
          </li>
          <li>
            <strong>If 30% reservation payment is made:</strong>
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>
                <strong>No Cancellations:</strong> Once a customer pays the 30%
                booking reservation, cancellations are not allowed under any
                circumstances. No refund will be issued.
              </li>
            </ul>
          </li>
        </ul>
      </Section>

      <Section title="5. Guest Responsibilities">
        <ul className="list-disc list-inside">
          <li>Maintain decorum and follow property rules.</li>
          <li>Guests may be charged for property damage.</li>
          <li>
            Illegal/disruptive behavior may lead to cancellation without refund.
          </li>
        </ul>
      </Section>

      <Section title="6. Check-In and Check-Out">
        <ul className="list-disc list-inside">
          <li>Check-in and check-out times are listed during booking.</li>
          <li>
            Early/late requests may incur extra charges and depend on
            availability.
          </li>
        </ul>
      </Section>

      <Section title="7. Website Use">
        <ul className="list-disc list-inside">
          <li>
            Do not introduce malicious content or use the site unlawfully.
          </li>
          <li>
            Soliciting others to break the law via our platform is prohibited.
          </li>
        </ul>
      </Section>

      <Section title="8. Intellectual Property">
        All content, trademarks, and logos on Brij Divine Stay are owned by us
        or licensed to us. Unauthorized use is prohibited.
      </Section>

      <Section title="9. Limitation of Liability">
        Brij Divine Stay is not liable for indirect, incidental, or
        consequential damages from service use, including data or profit loss.
      </Section>

      <Section title="10. Modifications">
        We may update these Terms at any time. Continued use of the website
        confirms acceptance of changes.
      </Section>

      <Section title="11. Governing Law">
        These Terms are governed by Indian law. Legal matters will fall under
        the jurisdiction of courts in Mathura, Uttar Pradesh.
      </Section>

      <Section title="12. Contact Us">
        <p>Brij Divine Stay</p>
        <p>Call Us: +91-9258 01 02 00</p>
        <p>Email: support@brijdivinestay.com</p>
        <p>
          Visit Us: Near Roadways Bus Stand, Vrindavan, Mathura - 281121, India
        </p>
      </Section>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="text-base">{children}</div>
  </div>
);

export default TermsAndConditions;
