import React from "react";
import { Hotel, Lock, MapPin } from "lucide-react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            About Brij Divine Stay
          </h1>
          <div className="h-1 w-24 bg-[#6A5631] mx-auto my-4 rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for comfortable and spiritual stays in the
            sacred lands of Brij, Mathura, and Vrindavan.
          </p>
        </div>

        {/* Our Story Section - Two Column */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center mb-24">
          {/* Image Column */}
          <div className="w-full md:w-1/2">
            <div className="bg-[#6A5631]/10 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              <div className="text-[#6A5631] text-[120px] md:text-[180px]">
                ॐ
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Brij Divine Stay was founded with a vision to simplify hotel
                room bookings in one of the most spiritually significant regions
                of India.
              </p>
              <p>
                We understand the unique needs of devotees and travelers
                visiting Mathura and Vrindavan, and we strive to offer
                hassle-free, reliable, and affordable accommodations that
                enhance their journey.
              </p>
            </div>
          </div>
        </div>
{/*  */}
        {/* What We Offer Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <div className="h-1 w-20 bg-[#6A5631] mx-auto"></div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Hotel Range */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-[#6A5631]/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <Hotel className="text-[#6A5631]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Wide Range of Hotels
              </h3>
              <p className="text-gray-600">
                From budget-friendly guest houses to luxurious stays.
              </p>
            </div>

            {/* Easy Booking */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-[#6A5631]/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <Lock className="text-[#6A5631]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Easy & Secure Booking
              </h3>
              <p className="text-gray-600">
                A seamless and stress-free reservation experience.
              </p>
            </div>

            {/* Proximity */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-[#6A5631]/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                <MapPin className="text-[#6A5631]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Proximity to Sacred Sites
              </h3>
              <p className="text-gray-600">
                Stay close to key temples and spiritual landmarks.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto mb-16">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Choose Brij Divine Stay?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-[#6A5631]/20 rounded-lg bg-[#6A5631]/5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Devotional Experience
                </h3>
                <p className="text-gray-600 text-sm">
                  Stays curated with spiritual ambiance
                </p>
              </div>
              <div className="text-center p-4 border border-[#6A5631]/20 rounded-lg bg-[#6A5631]/5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-gray-600 text-sm">No hidden charges</p>
              </div>
              <div className="text-center p-4 border border-[#6A5631]/20 rounded-lg bg-[#6A5631]/5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Local Expertise
                </h3>
                <p className="text-gray-600 text-sm">
                  Best recommendations with in-depth knowledge
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-gray-600 mb-6">
            At <span className="font-semibold">Brij Divine Stay</span>, we
            believe that a peaceful and comfortable stay is an integral part of
            a fulfilling spiritual journey. Whether you are visiting for
            pilgrimage, leisure, or exploration, we are here to make your trip
            memorable and divine.
          </p>
          <div className="inline-block bg-[#6A5631] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#5a4827] transition-colors">
            Plan your stay with us today!
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
