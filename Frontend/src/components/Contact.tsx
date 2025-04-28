import { PhoneCall, Mail, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="w-full max-w-5xl space-y-12 text-center">
        {/* Heading */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to show you how you can experience divine peace at our
            stay, enhance your spiritual journey, and feel closer to Vrindavan's
            heart. Reach out to our team anytime.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Call */}
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
            <PhoneCall className="mx-auto text-indigo-600" size={40} />
            <h3 className="text-xl font-semibold mt-5">Call Us</h3>
            <p className="mt-3 text-gray-500 text-sm">+91-9258 01 02 00</p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
            <Mail className="mx-auto text-indigo-600" size={40} />
            <h3 className="text-xl font-semibold mt-5">Email Us</h3>
            <p className="mt-3 text-gray-500 text-sm break-words">
              support@brijdivinestay.com
            </p>
          </div>

          {/* Visit */}
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all">
            <MapPin className="mx-auto text-indigo-600" size={40} />
            <h3 className="text-xl font-semibold mt-5">Visit Us</h3>
            <p className="mt-3 text-gray-500 text-sm break-words">
              Near Roadways Bus stand, Vrindavan, Mathura - 281121, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
