import React, { useState } from "react";
import {
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sun,
  Globe,
  UserCheck,
  Coffee,
  Plus,
  Minus,
} from "lucide-react";

const itinerary = [
  {
    day: 1,
    title: "Mathura & Gokul",
    image:
      "https://share.google/3Z6mYGQVRS2ImcHRH",
    morning: {
      title: "Morning – Mathura",
      items: [
        {
          name: "Shri Krishna Janmabhoomi",
          time: "09:00 AM",
          desc: "The sacred birthplace of Lord Krishna, one of the most important pilgrimage sites in India.",
        },
        {
          name: "Dwarkadhish Temple",
          time: "10:30 AM",
          desc: "A grand temple known for its intricate architecture and vibrant devotional atmosphere.",
        },
      ],
    },
    afternoon: {
      title: "Afternoon – Gokul",
      items: [
        {
          name: "Raman Reti",
          desc: "The holy sands where Lord Krishna spent his childhood with friends.",
        },
        {
          name: "84 Khamba",
          desc: "A historic architectural structure supported by 84 stone pillars.",
        },
        {
          name: "Brahmand Ghat",
          desc: "The divine place where Krishna revealed the universe to Mother Yashoda.",
        },
        {
          name: "Chintaharan Ghat",
          desc: "A peaceful Yamuna ghat believed to remove worries and stress.",
        },
      ],
    },
  },
  {
    day: 2,
    title: "Nandgaon, Barsana & Govardhan",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200",
    morning: {
      title: "Morning – Nandgaon & Barsana",
      items: [
        {
          name: "Nand Mahal",
          desc: "The residence of Nanda Baba, foster father of Lord Krishna.",
        },
        {
          name: "Radha Rani Temple",
          desc: "A hilltop temple in Barsana dedicated to Shri Radha Rani.",
        },
        {
          name: "Kirti Mandir",
          desc: "The birthplace of Radha Rani’s mother, Kirti Maiya.",
        },
        {
          name: "Gahvar Van",
          desc: "A sacred forest where Radha and Krishna performed divine pastimes.",
        },
      ],
    },
    afternoon: {
      title: "Afternoon – Govardhan Parikrama",
      items: [
        {
          name: "Dan Ghati Temple",
          desc: "The main temple marking the beginning of Govardhan Parikrama.",
        },
        {
          name: "Radha Kund & Shyam Kund",
          desc: "The most sacred water ponds in the entire Braj region.",
        },
        {
          name: "Jatipura",
          desc: "A major stop during Govardhan Parikrama.",
        },
        {
          name: "Poochha Ka Lota",
          desc: "A unique and spiritually significant rock formation.",
        },
      ],
    },
  },
  {
    day: 3,
    title: "Vrindavan",
    image:
      "https://images.unsplash.com/photo-1582234053074-972f7c050d4d?auto=format&fit=crop&q=80&w=1200",
    morning: {
      title: "Morning – Vrindavan Temples",
      items: [
        {
          name: "Banke Bihari Temple",
          time: "08:30 AM",
          desc: "The most famous temple of Vrindavan, known for its unique darshan style.",
        },
        {
          name: "Radha Vallabh Temple",
          desc: "A temple focusing on devotion to Shri Radha as supreme.",
        },
        {
          name: "Nidhivan",
          desc: "A mystical forest believed to host divine Raas Leela every night.",
        },
        {
          name: "Radha Raman & Rangji Temple",
          desc: "Ancient temples known for devotion and South Indian architecture.",
        },
      ],
    },
    afternoon: {
      title: "Evening – Spiritual Experience",
      items: [
        {
          name: "Prem Mandir",
          desc: "A beautifully illuminated marble temple symbolizing divine love.",
        },
        {
          name: "ISKCON Temple",
          desc: "Krishna-Balaram Mandir, a global center for devotion.",
        },
        {
          name: "Chandrodaya Mandir",
          desc: "Upcoming world’s tallest Krishna temple.",
        },
        {
          name: "Kamal Mandir",
          desc: "A peaceful lotus-shaped temple perfect for meditation.",
        },
      ],
    },
  },
];

// Pricing configuration
const pricing = {
  baseTour: 1499, // per person
  food: 350, // per person per day
  stay: 1000, // per day for up to 3 people (shared room)
};

const Tours: React.FC = () => {
  const [guests, setGuests] = useState(3);
  const [includeFood, setIncludeFood] = useState(false);
  const [includeStay, setIncludeStay] = useState(false);


  const calculateStayCost = () => {
    if (guests <= 3) return pricing.stay; // ₹1000 per day for up to 3 people
    if (guests === 4) return pricing.stay + 500; // ₹1000 + ₹500 for 4th person
    if (guests <= 6) return 2000; // ₹2000 per day for 5-6 people (2 rooms)
    return 2500; // ₹2500 per day for 7-8 people (2 rooms + half room)
  };

  const calculateTotal = () => {
    let total = pricing.baseTour * guests;
    if (includeFood) total += pricing.food * guests * 3; // 3 days
    if (includeStay) total += calculateStayCost() * 3; // Stay cost for 3 days
    return total;
  };


  // Sticky Pricing Sidebar Component (Desktop/Tablet)
  const StickyPricingSidebar = () => (
    <div className="hidden lg:block fixed right-4 top-1/3 z-50 w-80">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 backdrop-blur-sm bg-white/95">
        <h3 className="text-base lg:text-lg font-bold text-[#2D241C] mb-3 lg:mb-4 text-center">Your Package Summary</h3>

        {/* Guest Counter */}
        <div className="mb-3 lg:mb-4">
          <h4 className="font-semibold text-xs lg:text-sm mb-2 lg:mb-3 text-center text-[#EBC486]">Number of Guests</h4>
          <div className="flex items-center justify-center gap-2 lg:gap-3 bg-gray-50 rounded-lg lg:rounded-xl p-2">
            <button
              onClick={() => setGuests(Math.max(3, guests - 1))}
              className="bg-[#EBC486] text-[#2D241C] p-1.5 lg:p-2 rounded-full hover:bg-[#D4AF37] transition-all duration-200 hover:scale-105 shadow-md"
            >
              <Minus size={14} className="lg:w-4 lg:h-4" />
            </button>
            <div className="text-center min-w-[50px] lg:min-w-[60px]">
              <span className="text-lg lg:text-xl font-bold block">{guests}</span>
              <span className="text-xs text-gray-500">Guests</span>
            </div>
            <button
              onClick={() => setGuests(Math.min(8, guests + 1))}
              className="bg-[#EBC486] text-[#2D241C] p-1.5 lg:p-2 rounded-full hover:bg-[#D4AF37] transition-all duration-200 hover:scale-105 shadow-md"
            >
              <Plus size={14} className="lg:w-4 lg:h-4" />
            </button>
          </div>
        </div>

        {/* Package Options */}
        <div className="space-y-2 lg:space-y-3 mb-3 lg:mb-4">
          {/* Base Tour */}
          <div className="bg-[#EBC486]/10 rounded-lg lg:rounded-xl p-2 lg:p-3 border border-[#EBC486]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#EBC486] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={12} className="lg:w-[14px] lg:h-[14px] text-[#2D241C]" />
                </div>
                <div>
                  <p className="font-semibold text-xs lg:text-sm text-[#2D241C]">Tour Package</p>
                  <p className="text-xs text-gray-600">3 Days Spiritual</p>
                </div>
              </div>
              <p className="font-bold text-xs lg:text-sm text-[#2D241C]">₹{(pricing.baseTour * guests).toLocaleString()}</p>
            </div>
          </div>

          {/* Food Option */}
          <div className={`rounded-lg lg:rounded-xl p-2 lg:p-3 border-2 transition-all duration-200 ${
            includeFood
              ? 'bg-[#EBC486]/10 border-[#EBC486]'
              : 'bg-gray-50 border-gray-200 hover:border-[#EBC486]/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIncludeFood(!includeFood)}
                  className={`w-5 h-5 lg:w-6 lg:h-6 rounded-md lg:rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    includeFood
                      ? 'bg-[#EBC486] border-[#EBC486]'
                      : 'border-gray-300 hover:border-[#EBC486]'
                  }`}
                >
                  {includeFood && <CheckCircle2 size={12} className="lg:w-[14px] lg:h-[14px] text-[#2D241C]" />}
                </button>
                <div>
                  <p className="font-semibold text-xs lg:text-sm text-[#2D241C] flex items-center gap-1">
                    <Coffee size={12} className="lg:w-[14px] lg:h-[14px] text-[#EBC486]" /> Meals
                  </p>
                  <p className="text-xs text-gray-600">3 Days</p>
                </div>
              </div>
              <p className="font-bold text-xs lg:text-sm text-[#2D241C]">₹{(pricing.food * guests * 3).toLocaleString()}</p>
            </div>
          </div>

          {/* Stay Option */}
          <div className={`rounded-lg lg:rounded-xl p-2 lg:p-3 border-2 transition-all duration-200 ${
            includeStay
              ? 'bg-[#EBC486]/10 border-[#EBC486]'
              : 'bg-gray-50 border-gray-200 hover:border-[#EBC486]/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIncludeStay(!includeStay)}
                  className={`w-5 h-5 lg:w-6 lg:h-6 rounded-md lg:rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    includeStay
                      ? 'bg-[#EBC486] border-[#EBC486]'
                      : 'border-gray-300 hover:border-[#EBC486]'
                  }`}
                >
                  {includeStay && <CheckCircle2 size={12} className="lg:w-[14px] lg:h-[14px] text-[#2D241C]" />}
                </button>
                <div>
                  <p className="font-semibold text-xs lg:text-sm text-[#2D241C] flex items-center gap-1">
                    <UserCheck size={12} className="lg:w-[14px] lg:h-[14px] text-[#EBC486]" /> Stay
                  </p>
                  <p className="text-xs text-gray-600">
                    {guests <= 3 && "1 Room"}
                    {guests === 4 && "1 Room"}
                    {guests >= 5 && guests <= 6 && "2 Rooms"}
                    {guests >= 7 && "2 Rooms"}
                  </p>
                </div>
              </div>
              <p className="font-bold text-xs lg:text-sm text-[#2D241C]">₹{(calculateStayCost() * 3).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3 lg:pt-4">
          <div className="bg-[#2D241C] text-white rounded-lg lg:rounded-xl p-3 lg:p-4">
            <div className="flex justify-between items-center mb-2 lg:mb-3">
              <span className="text-xs lg:text-sm font-medium">Total Amount</span>
              <span className="text-base lg:text-lg font-bold text-[#EBC486]">₹{calculateTotal().toLocaleString()}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-[#EBC486] to-[#D4AF37] text-[#2D241C] py-2 lg:py-3 rounded-md lg:rounded-lg font-bold hover:from-[#D4AF37] hover:to-[#EBC486] transition-all duration-300 text-xs lg:text-sm shadow-lg hover:shadow-xl">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Bottom Bar Component
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);

  const MobileBottomBar = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white shadow-xl rounded-t-xl mx-2 mb-2 flex items-center justify-between px-4 py-3 border border-gray-200">
      <div className="flex items-center gap-2">
        <svg
          className="w-7 h-7 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <div>
          <div className="text-lg font-bold text-black">
            ₹{calculateTotal().toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">for {guests} guest{guests > 1 ? 's' : ''}</div>
        </div>
      </div>
      <button
        className="flex items-center gap-2 bg-[#EBC486] text-[#2D241C] font-bold px-5 py-2 rounded-lg shadow hover:bg-[#D4AF37] transition"
        onClick={() => setShowMobileOverlay(true)}
      >
        <span>Book Tour</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );

  // Mobile Overlay Component
  const MobileOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden transition-all">
      <div className="bg-white w-full rounded-t-2xl p-0 max-h-[92vh] overflow-y-auto relative shadow-2xl">
        {/* Custom Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
          <span className="font-bold text-black text-lg">
            Complete Your Booking
          </span>
          <button
            className="text-2xl text-black font-bold"
            onClick={() => setShowMobileOverlay(false)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <div className="bg-gradient-to-br from-[#2D241C] to-[#1a1611] rounded-xl p-4 text-white relative overflow-hidden mb-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#EBC486] rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#EBC486] rounded-full translate-y-6 -translate-x-6"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 className="text-lg sm:text-xl font-serif font-bold mb-2">
                  Begin Your Sacred Journey
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Customize your spiritual tour package and book your divine experience.
                </p>
              </div>

              {/* Guest Counter */}
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-3 text-center text-[#EBC486]">Number of Guests</h3>
                <div className="flex items-center justify-center gap-3 bg-white/10 rounded-xl p-2">
                  <button
                    onClick={() => setGuests(Math.max(3, guests - 1))}
                    className="bg-[#EBC486] text-[#2D241C] p-2 rounded-full hover:bg-[#D4AF37] transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="text-center min-w-[60px]">
                    <span className="text-xl font-bold block">{guests}</span>
                    <span className="text-xs text-gray-300">Guests</span>
                  </div>
                  <button
                    onClick={() => setGuests(Math.min(8, guests + 1))}
                    className="bg-[#EBC486] text-[#2D241C] p-2 rounded-full hover:bg-[#D4AF37] transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Package Options */}
              <div className="space-y-3 mb-4">
                {/* Base Tour */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#EBC486] rounded-full flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-[#2D241C]" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-white">Tour Package</p>
                        <p className="text-xs text-gray-300">3 Days Spiritual</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-[#EBC486]">₹{(pricing.baseTour * guests).toLocaleString()}</p>
                  </div>
                </div>

                {/* Food Option */}
                <div className={`rounded-xl p-3 border-2 transition-all duration-200 ${
                  includeFood
                    ? 'bg-[#EBC486]/10 border-[#EBC486]'
                    : 'bg-gray-50 border-gray-200 hover:border-[#EBC486]/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIncludeFood(!includeFood)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          includeFood
                            ? 'bg-[#EBC486] border-[#EBC486]'
                            : 'border-gray-300 hover:border-[#EBC486]'
                        }`}
                      >
                        {includeFood && <CheckCircle2 size={14} className="text-[#2D241C]" />}
                      </button>
                      <div>
                        <p className="font-semibold text-sm text-[#2D241C] flex items-center gap-1">
                          <Coffee size={14} className="text-[#EBC486]" /> Meals
                        </p>
                        <p className="text-xs text-gray-600">3 Days</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-[#2D241C]">₹{(pricing.food * guests * 3).toLocaleString()}</p>
                  </div>
                </div>

                {/* Stay Option */}
                <div className={`rounded-xl p-3 border-2 transition-all duration-200 ${
                  includeStay
                    ? 'bg-[#EBC486]/10 border-[#EBC486]'
                    : 'bg-gray-50 border-gray-200 hover:border-[#EBC486]/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIncludeStay(!includeStay)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          includeStay
                            ? 'bg-[#EBC486] border-[#EBC486]'
                            : 'border-gray-300 hover:border-[#EBC486]'
                        }`}
                      >
                        {includeStay && <CheckCircle2 size={14} className="text-[#2D241C]" />}
                      </button>
                      <div>
                        <p className="font-semibold text-sm text-[#2D241C] flex items-center gap-1">
                          <UserCheck size={14} className="text-[#EBC486]" /> Stay
                        </p>
                        <p className="text-xs text-gray-600">
                          {guests <= 3 && "1 Room"}
                          {guests === 4 && "1 Room"}
                          {guests >= 5 && guests <= 6 && "2 Rooms"}
                          {guests >= 7 && "2 Rooms"}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-[#2D241C]">₹{(calculateStayCost() * 3).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-white/30 pt-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-300">Total Amount</span>
                    <span className="text-lg font-bold text-[#EBC486]">₹{calculateTotal().toLocaleString()}</span>
                  </div>
            <button className="w-full bg-gradient-to-r from-[#EBC486] to-[#D4AF37] text-[#2D241C] py-3 rounded-lg font-bold hover:from-[#D4AF37] hover:to-[#EBC486] transition-all duration-300 text-sm shadow-lg">
              Book Now
            </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="bg-[#FAF9F6] text-[#2D241C] relative lg:pr-96">
      {/* Sticky Pricing Sidebar (Desktop) */}
      <StickyPricingSidebar />

      {/* Mobile Bottom Bar */}
      <MobileBottomBar />

      {/* HERO */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center text-white">
        <img
          src="https://images.unsplash.com/photo-1624640149023-e18e97669f91"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Brij Darshan Tour"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl text-center px-3 sm:px-4 md:px-6">
          <span className="text-xs sm:text-sm tracking-widest uppercase text-[#EBC486]">
            Sacred Pilgrimage Experience
          </span>
          <h1 className="mt-3 sm:mt-4 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight">
            Brij Darshan – 3 Day Spiritual Tour
          </h1>
          <p className="mt-3 sm:mt-4 md:mt-6 text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed px-2">
            A soulful journey through Mathura, Gokul, Barsana, Govardhan and
            Vrindavan — experiencing the divine land of Lord Krishna.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="bg-[#EBC486] text-[#2D241C] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white transition text-sm sm:text-base">
              Book Your Tour <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button className="border border-white/40 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 transition text-sm sm:text-base">
              View Gallery
            </button>
          </div>
        </div>
      </section>

      {/* META */}
      <section className="-mt-6 sm:-mt-8 md:-mt-10 relative z-20 px-3 sm:px-4 md:px-6 pb-0 lg:pb-0">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            { icon: Clock, label: "Duration", value: "3 Days / 2 Nights" },
            { icon: Sun, label: "Timings", value: "07:00 AM – 07:00 PM" },
            { icon: Users, label: "Group Size", value: "3-8 Guests" },
            { icon: Globe, label: "Languages", value: "Hindi & English" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl text-center shadow-sm">
              <Icon className="mx-auto mb-1.5 sm:mb-2 text-[#6A5631] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <p className="text-xs sm:text-sm uppercase text-gray-400">{label}</p>
              <p className="font-bold text-xs sm:text-sm md:text-base">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SUMMARY */}
      <section className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 lg:py-16 pb-24 sm:pb-24 md:pb-24 lg:pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-[#2D241C] mb-2 sm:mb-3">
              Transparent Pricing Structure
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
              Comprehensive pricing breakdown for your spiritual journey
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              <div className="text-center group">
                <div className="bg-[#EBC486]/10 rounded-md sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 group-hover:bg-[#EBC486]/20 transition-colors">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EBC486] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2D241C]" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#2D241C]">Spiritual Tour</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D241C] mb-0.5 sm:mb-1">₹{pricing.baseTour.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-500">per person</p>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-[#EBC486]/10 rounded-md sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 group-hover:bg-[#EBC486]/20 transition-colors">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EBC486] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <Coffee className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2D241C]" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#2D241C]">Gourmet Meals</h3>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2D241C] mb-0.5 sm:mb-1">₹{pricing.food.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-gray-500">per person/day</p>
                </div>
              </div>

              <div className="text-center group sm:col-span-2 md:col-span-1">
                <div className="bg-[#EBC486]/10 rounded-md sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 group-hover:bg-[#EBC486]/20 transition-colors">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EBC486] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2D241C]" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#2D241C]">Premium Stay</h3>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#2D241C] mb-0.5 sm:mb-1">₹1,000 - ₹2,500</p>
                  <p className="text-xs sm:text-sm text-gray-500">per day (group)</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Starting Package Price</p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D241C] mb-1 sm:mb-2">₹{(pricing.baseTour * 3).toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-500">for 3 guests • Complete spiritual experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ITINERARY */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 pb-24 sm:pb-24 md:pb-24 lg:pb-0 space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16 xl:space-y-20">
        {itinerary.map((day) => (
          <div key={day.day}>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif font-bold mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-1 sm:px-2">
              Day {day.day}: {day.title}
            </h2>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
              <img
                src={day.image}
                alt={day.title}
                className="rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg w-full h-[180px] sm:h-[240px] md:h-[280px] lg:h-[320px] xl:h-[380px] object-cover"
              />

              <div className="space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                    <Sun size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" /> {day.morning.title}
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                    {day.morning.items.map((item, i) => (
                      <li key={i}>
                        <p className="font-semibold text-xs sm:text-sm lg:text-base">
                          {item.name}{" "}
                          {item.time && (
                            <span className="text-xs text-[#6A5631] ml-0.5 sm:ml-1 md:ml-2">
                              ({item.time})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-1.5 sm:mb-2 md:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                    <Clock size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-[18px] lg:h-[18px]" /> {day.afternoon.title}
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2 md:space-y-3">
                    {day.afternoon.items.map((item, i) => (
                      <li key={i}>
                        <p className="font-semibold text-xs sm:text-sm lg:text-base">{item.name}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 lg:py-16 pb-24 sm:pb-24 md:pb-24 lg:pb-0">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#EBC486]/20 to-[#D4AF37]/20 rounded-2xl p-8 sm:p-10 md:p-12 backdrop-blur-sm border border-[#EBC486]/30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D241C] mb-4">
              Ready for Your Divine Journey?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              Use the pricing calculator on the right to customize your spiritual tour package.
              Experience the sacred lands of Lord Krishna with personalized service and authentic hospitality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Expert Spiritual Guides</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Authentic Local Cuisine</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Sacred Site Access</span>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">Trusted by spiritual seekers worldwide</p>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#EBC486] rounded-full"></div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              © 2024 Brij Divine Stay – Your Trusted Brij Travel Partner
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Overlay */}
      {showMobileOverlay && <MobileOverlay />}
    </div>
  );
};

export default Tours;
