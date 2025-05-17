import { PhoneCall, Mail, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Heading with decorative element */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="h-1.5 w-16 bg-indigo-600 mx-auto mb-3 rounded-full"></div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <div className="h-1.5 w-16 bg-indigo-600 mx-auto mt-3 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            We'd love to show you how you can experience divine peace at our
            stay, enhance your spiritual journey, and feel closer to Vrindavan's
            heart. Reach out to our team anytime.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Call */}
          <a
            href="tel:+919258010200"
            className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <PhoneCall className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Call Us</h3>
            <p className="text-gray-600 font-medium">+91-9258 01 02 00</p>
          </a>

          {/* Email */}
          <a
            href="mailto:support@brijdivinestay.com"
            className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <Mail className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Email Us</h3>
            <p className="text-gray-600 font-medium break-words">
              support@brijdivinestay.com
            </p>
          </a>

          {/* Visit */}
          <a
            href="https://maps.google.com/?q=Vrindavan,Mathura,281121,India"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
              <MapPin className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Visit Us</h3>
            <p className="text-gray-600 font-medium break-words">
              Near Roadways Bus stand, Vrindavan, Mathura - 281121, India
            </p>
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
