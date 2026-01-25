import React, { useState, useEffect } from "react";
import img1 from "../assets/bg1.png";
import img2 from "../assets/bg2.jpg";
import img3 from "../assets/bg3.png";
import img4 from "../assets/mathura.png";
import {
  Clock,
  Banknote,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Car,
  Rainbow,
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
      img4,
    morning: {
      title: "Morning – Mathura",
      items: [
        {
          name: "Shri Krishna Janmabhoomi",
          desc: "The sacred birthplace of Lord Krishna, one of the most important pilgrimage sites in India.",
        },
        {
          name: "Dwarkadhish Temple",
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
      img3,
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
          name: "Poochhri Ka Lota",
          desc: "A unique and spiritually significant rock formation.",
        },
      ],
    },
  },
  {
    day: 3,
    title: "Vrindavan",
    image:
    img1,
    morning: {
      title: "Morning – Vrindavan Temples",
      items: [
        {
          name: "Banke Bihari Temple",
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

const Tours: React.FC = () => {
  const [guests, setGuests] = useState(3);
  const [includeFood, setIncludeFood] = useState(false);
  const [includeStay, setIncludeStay] = useState(false);

  // Pricing configuration
  const pricing = {
    baseTour: 1499, // per person
    food: 350, // per person per day
    stay: 1000, // per day for up to 3 people (shared room)
  };

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides data
  const slides = [
    {
      title: "Brij Darshan – 3 Day Spiritual Tour",
      subtitle: "Sacred Pilgrimage Experience",
      description: "A soulful journey through Mathura, Gokul, Barsana, Govardhan and Vrindavan — experiencing the divine land of Lord Krishna.",
      highlight: "Divine Heritage"
    },
    {
      title: "Experience the Divine Land",
      subtitle: "Authentic Spiritual Journey",
      description: "Walk in the footsteps of Lord Krishna, visit sacred temples, and immerse yourself in the rich cultural heritage of Brij Bhoomi.",
      highlight: "Sacred Places"
    },
    {
      title: "Personalized Spiritual Experience",
      subtitle: "Tailored for Your Soul",
      description: "Customize your pilgrimage with expert guides, authentic cuisine, and premium accommodations for a truly transformative experience.",
      highlight: "Divine Connection"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Navigation functions
  // const goToSlide = (index: number) => {
  //   setCurrentSlide(index);
  // };

 


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


  // Compact Vertical Card - Details Page Style
  const PricingCalculator = () => (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ">
        {/* Card Header - Like room type overlay */}
        <div className="bg-gradient-to-r from-[#6A5631] to-[#5a4a2a] px-4 py-3">
          <h3 className="text-lg font-semibold text-white text-center">
            Spiritual Tour Package
          </h3>
          <p className="text-xs text-amber-100 text-center mt-1">
            3 Days / 2 Nights • {guests} Guests
          </p>
        </div>

        {/* Card Content - Compact like room details */}
        <div className="p-4 space-y-4">
          {/* Price Display - Prominent like room price */}
          <div className="text-center">
            <div className="text-3xl font-bold text-[#6A5631] mb-1">
              ₹{calculateTotal().toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Package Price</div>
          </div>

          {/* Guest Counter - Compact */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <span className="text-sm font-medium text-gray-700">Guests</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(Math.max(3, guests - 1))}
                className="bg-[#6A5631] text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#5a4a2a] transition-colors text-sm"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-bold min-w-[20px] text-center">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(8, guests + 1))}
                className="bg-[#6A5631] text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#5a4a2a] transition-colors text-sm"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Package Options - Vertical list like room features */}
          <div className="space-y-3">
            {/* Base Tour - Always included */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-800">Tour Package</span>
              </div>
              <span className="text-sm font-bold text-[#6A5631]">₹{(pricing.baseTour * guests).toLocaleString()}</span>
            </div>

            {/* Meals Option */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="food-option"
                  checked={includeFood}
                  onChange={(e) => setIncludeFood(e.target.checked)}
                  className="w-4 h-4 text-[#6A5631] border-gray-300 rounded focus:ring-[#6A5631]"
                />
                <span className="text-sm font-medium text-gray-800">Meals Package</span>
              </div>
              <span className="text-sm font-bold text-[#6A5631]">₹{(pricing.food * guests * 3).toLocaleString()}</span>
            </div>

            {/* Stay Option */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stay-option"
                  checked={includeStay}
                  onChange={(e) => setIncludeStay(e.target.checked)}
                  className="w-4 h-4 text-[#6A5631] border-gray-300 rounded focus:ring-[#6A5631]"
                />
                <span className="text-sm font-medium text-gray-800">Accommodation</span>
              </div>
              <span className="text-sm font-bold text-[#6A5631]">₹{(calculateStayCost() * 3).toLocaleString()}</span>
            </div>
          </div>

          {/* Book Button - Like room selection */}
          <button className="w-full bg-[#6A5631] text-white py-3 rounded-lg font-semibold hover:bg-[#5a4a2a] transition duration-200 shadow-md">
            Book Now
          </button>

          {/* Package Info */}
          <div className="text-center">
            {/* <p className="text-xs text-gray-500">
              Includes transportation & expert guide
            </p> */}
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
    <div className="bg-[#FAF9F6] text-[#2D241C] relative">
      {/* Mobile Bottom Bar */}
      <MobileBottomBar />

      {/* HERO CAROUSEL */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background with images */}
        {slides.map((_, index) => (
          <div
            key={`bg-${index}`}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            <img
              src={index % 2 === 0 ? img1 : img2}
              alt={`Slide ${index + 1} background`}
              className="w-full h-full object-cover"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* Carousel Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 transform ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full absolute inset-0'
                  : 'opacity-0 translate-x-full absolute inset-0'
              }`}
            >
              <div className="text-center text-white">
                <span className="inline-block px-4 py-1 bg-[#EBC486]/20 text-[#EBC486] text-xs sm:text-sm tracking-widest uppercase rounded-full border border-[#EBC486]/30 mb-4">
                  {slide.highlight}
                </span>
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2 mb-6">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button className="mx-auto bg-[#EBC486] text-[#2D241C]  px-6 sm:px-6 py-3 sm:py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white transition text-sm sm:text-base shadow-lg hover:shadow-xl">
                    Book Your Tour <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  {/* <button className="border border-white/40 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 transition text-sm sm:text-base">
                    View Gallery
                  </button> */}
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full transition-all duration-200 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#EBC486]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full transition-all duration-200 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#EBC486]" />
          </button> */}

          {/* Slide Indicators */}
          {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#EBC486] w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* META */}
      <section className="mt-6 sm:-mt-8 md:-mt-10 relative z-20 px-3 sm:px-4 md:px-6 pb-0 lg:pb-0">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            { icon: Clock, label: "Duration", value: "3 Days / 2 Nights" },
            { icon: Car, label: "Customizable Tour Package", value: "Meals • Stay • Travel" },
            { icon: Banknote, label: "Transparent Pricing", value: "Clear & honest pricing" },
            { icon: Rainbow, label: "Spiritual Experience", value: "Guided temple visits" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl text-center shadow-sm">
              <Icon className="mx-auto mb-1.5 sm:mb-2 text-[#6A5631] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <p className="text-xs sm:text-sm uppercase text-gray-400">{label}</p>
              <p className="font-bold text-xs sm:text-sm md:text-base">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT LAYOUT */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/50 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 xl:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
            {/* ITINERARY SECTION - Left Column */}
            <div className="lg:col-span-8 xl:col-span-7">
              <div className="space-y-8 lg:space-y-12 xl:space-y-16">
                {/* Section Header */}
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D241C] mb-4">
                    Your Spiritual Journey
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Experience the divine path through sacred places and timeless traditions
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-[#EBC486] to-[#D4AF37] mx-auto lg:mx-0 mt-6 rounded-full"></div>
                </div>

                {/* Itinerary Days */}
                {itinerary.map((day) => (
                  <div key={day.day} className="group">
                    {/* Day Header with elegant styling */}
                    <div className="flex items-center gap-4 mb-6 lg:mb-8">
                      <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#6A5631] to-[#5a4a2a] rounded-full shadow-lg">
                        <span className="text-lg lg:text-xl font-bold text-white">{day.day}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#2D241C] mb-1">
                          {day.title}
                        </h3>
                        <div className="w-16 h-0.5 bg-[#EBC486] rounded-full"></div>
                      </div>
                    </div>

                    {/* Day Content Card */}
                    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                      <div className="grid grid-rows-1  lg:grid-rows-1 gap-0 ">
                        {/* Image Section */}
                        <div className="relative overflow-hidden h">
                          <img
                            src={day.image}
                            alt={day.title}
                            className="w-full h-50 sm:h-80 lg:h-50 object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          {/* Day number overlay */}
                          <div className="absolute top-0 left-4 lg:top-6 lg:left-6">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 lg:px-4 lg:py-2">
                              <span className="text-sm lg:text-base font-semibold text-[#2D241C]">Day {day.day}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 lg:p-8 xl:p-10 space-y-6 lg:space-y-8">
                          {/* Morning Session */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#EBC486]/10 rounded-lg">
                                <Car className="w-5 h-5 lg:w-6 lg:h-6 text-[#6A5631]" />
                              </div>
                              <h4 className="text-lg lg:text-xl font-semibold text-[#2D241C]">
                                {day.morning.title}
                              </h4>
                            </div>
                            <ul className="space-y-3 lg:space-y-4">
                              {day.morning.items.map((item, i) => (
                                <li key={i} className="flex gap-3">
                                  <div className="w-2 h-2 bg-[#EBC486] rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-semibold text-[#2D241C] text-sm lg:text-base">
                                      {item.name}
                                      {/* {item.time && (
                                        <span className="text-[#6A5631] ml-2 font-medium">
                                          ({item.time})
                                        </span>
                                      )} */}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Afternoon Session */}
                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#EBC486]/10 rounded-lg">
                                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-[#6A5631]" />
                              </div>
                              <h4 className="text-lg lg:text-xl font-semibold text-[#2D241C]">
                                {day.afternoon.title}
                              </h4>
                            </div>
                            <ul className="space-y-3 lg:space-y-4">
                              {day.afternoon.items.map((item, i) => (
                                <li key={i} className="flex gap-3">
                                  <div className="w-2 h-2 bg-[#EBC486] rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-semibold text-[#2D241C] text-sm lg:text-base">
                                      {item.name}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING CALCULATOR - Right Column */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-5 ">
              <div className="lg:sticky lg:top-8 xl:top-12">
                {/* Section Header */}
                <div className="text-center lg:text-left mb-8">
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-[#2D241C] mb-2">
                    Customize Your Package
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    Personalize your spiritual journey with our flexible pricing options
                  </p>
                </div>

                {/* Calculator Card */}
                <div className=" overflow-hidden">
                  <PricingCalculator />
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    {/* <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-[#EBC486] rounded-full"></div>
                      ))}
                    </div> */}
                    {/* <span className="text-sm text-gray-600 font-medium">4.9/5 Rating</span> */}
                  </div>
                  {/* <p className="text-xs text-gray-500">
                    Trusted by 500+ spiritual seekers
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

   {/* CTA */}
   <section className="px-3 sm:px-4 md:px-6 pb-24 sm:pb-24 md:pb-24 lg:pb-0">
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
