import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

import img1 from "../assets/bg1.png";
import img2 from "../assets/bg2.jpg";
import img3 from "../assets/bg3.png";
import img4 from "../assets/mathura.png";

/* ---------------- HERO IMAGES ---------------- */

const heroImages = [img1, img2, img3, img4];

/* ---------------- PACKAGE DATA ---------------- */

const packages = [
  {
    id: "3-days-braj-darshan",
    title: "Essential Braj Darshan",
    tag: "3 Days / 2 Nights",
    price: "₹1,499",
    description:
      "Perfect short spiritual escape covering Mathura, Gokul & Vrindavan.",
    highlights: ["Mathura & Gokul", "Vrindavan Temples", "Govardhan Parikrama"],
    image: img3,
    popular: false,
    link: "/tours/3-days-braj-darshan",
  },
  {
    id: "5-days-braj-darshan",
    title: "Complete Braj Experience",
    tag: "5 Days / 4 Nights",
    price: "₹1,899",
    description:
      "Most loved package covering Braj Bhoomi in depth with sacred rituals.",
    highlights: ["All Braj locations", "Barsana & Nandgaon", "Aarti & Seva"],
    image: img4,
    popular: true,
    link: "/tours/5-days-braj-darshan",
  },
];

/* ---------------- HERO SLIDER ---------------- */

const HeroSlider = ({
  packagesRef,
}: {
  packagesRef: React.RefObject<HTMLDivElement>;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((i) => (i + 1) % heroImages.length),
      5000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[65vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden">
      {heroImages.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="Braj Bhoomi"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl text-center text-white"
        >
          <span className="inline-block bg-[#EBC486] text-[#2D241C] px-4 py-1 rounded-full text-xs font-semibold mb-4">
            SACRED TOUR PACKAGES
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-4 leading-tight">
            Discover the Sacred Land of{" "}
            <span className="text-[#EBC486]">Braj Bhoomi</span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-200 mb-8">
            Carefully curated 3 & 5-day spiritual journeys with local Braj
            experts
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                packagesRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="bg-[#EBC486] text-[#2D241C] px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              View Packages
            </button>

            <a
              href="https://wa.me/919258010200"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-green-400 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-400 transition"
            >
              <FaWhatsapp className="text-green-400" size={20} /> Chat on
              WhatsAp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- MAIN PAGE ---------------- */

const PackagesLandingPage: React.FC = () => {
  const packagesRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#FAF9F6] text-[#2D241C]"
    >
      <HeroSlider packagesRef={packagesRef} />

      {/* PACKAGES */}
      <section
        ref={packagesRef}
        id="packages"
        className="max-w-7xl mx-auto px-4 py-20"
      >
        <h2 className="text-3xl font-serif font-bold text-center mb-12">
          Our Most Loved Braj Yatra Packages
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={{
                hidden: { y: 30, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`relative bg-white rounded-2xl shadow-md p-6 flex flex-col hover:shadow-xl transition ${
                pkg.popular ? "ring-2 ring-[#EBC486]" : ""
              }`}
            >
              {pkg.popular && (
                <motion.div
                  variants={{
                    hidden: { y: 30, opacity: 0 },
                    show: { y: 0, opacity: 1 },
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute top-4 right-4 bg-[#EBC486] text-[#2D241C] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <Star size={12} /> Most Popular
                </motion.div>
              )}

              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-48 w-full object-cover rounded-xl mb-5"
              />

              <h3 className="text-2xl font-serif font-bold mb-2">
                {pkg.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Clock size={14} /> {pkg.tag}
              </div>

              <p className="text-gray-700 mb-4">{pkg.description}</p>

              <ul className="space-y-2 mb-6">
                {pkg.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <MapPin size={14} className="text-[#EBC486] mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="text-2xl font-bold">{pkg.price}</div>
                <p className="text-xs text-gray-500 mb-4">Per person</p>

                <Link
                  to={pkg.link}
                  className="block text-center bg-[#2D241C] text-white py-3 rounded-full font-semibold hover:bg-black transition"
                >
                  View Itinerary
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-3xl font-serif font-bold mb-4">
            What Our Pilgrims Say
          </h2>
          <p className="text-gray-600 mb-12">
            Real experiences from devotees who traveled with us
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Anita Sharma",
                place: "Delhi",
                text: "The Braj Yatra was beautifully organized. Everything felt peaceful and divine.",
              },
              {
                name: "Rakesh Gupta",
                place: "Jaipur",
                text: "Very authentic temples and knowledgeable guides. Highly recommended.",
              },
              {
                name: "Meera Joshi",
                place: "Mumbai",
                text: "A truly spiritual journey. Brij Divine Stay took care of everything.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-[#FAF9F6] rounded-2xl p-6 shadow-sm"
              >
                <p className="text-gray-700 mb-4 text-sm">“{t.text}”</p>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-gray-500">{t.place}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}

      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Gradient */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-[#1f1a14] via-[#2D241C] to-[#1f1a14]"
        />

        {/* Decorative Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#EBC486]/20 blur-[120px]" />

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <span className="inline-block mb-4 px-4 py-1 text-xs tracking-widest rounded-full bg-[#EBC486] text-[#2D241C] font-semibold">
            PERSONALIZED BRAJ YATRA
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
            Let Us Plan Your <br />
            <span className="text-[#EBC486]">Perfect Braj Yatra</span>
          </h2>

          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Speak directly with our spiritual travel experts and receive a
            customized itinerary based on your devotion, time, and comfort.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+919258010200"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#EBC486] text-[#2D241C] px-8 py-4 rounded-full font-semibold hover:opacity-90 transition shadow-xl"
            >
              <FaPhoneAlt className="text-green-400" size={20} /> Talk to a
              Travel Expert
            </a>

            <a
              href="https://wa.me/919258010200"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition"
            >
              <FaWhatsapp className="text-green-400" size={20} /> Chat on
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PackagesLandingPage;
