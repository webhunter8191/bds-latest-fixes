import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import tourData from "../data/tour.json";
import img1 from "../assets/bg1.png";
import img2 from "../assets/mathura.png";

const tours = tourData.tours;
const tourImages = [img1, img2];

const LuxeStylePackageBanner = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  /* AUTO SLIDE – MOBILE ONLY */
  useEffect(() => {
    if (!isMobile || paused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % tours.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [paused, isMobile]);

  /* SCROLL TO ACTIVE */
  useEffect(() => {
    if (!sliderRef.current || !isMobile) return;

    sliderRef.current.scrollTo({
      left: index * sliderRef.current.clientWidth,
      behavior: "smooth",
    });
  }, [index, isMobile]);

  const getHighlights = (itinerary: any[]) => {
    return itinerary
      .map((day) => day?.title)
      .filter(Boolean)
      .slice(0, 4);
  };

  return (
    <section className="mx-auto py-12 lg:py-16 px-4 sm:px-6 lg:px-8 flex items-center  ">
      <div className="max-w-[92vw] lg:max-w-[80vw] mx-auto  rounded-2xl lg:rounded-3xl bg-gradient-to-b from-[#FFF9F2] via-[#FFF1D6] to-[#FFF6E8]  ">
        <div
          className="rounded-2xl lg:rounded-3xl
        p-5 sm:p-6 lg:p-8
        flex flex-col lg:flex-row
        gap-6 lg:gap-8
        items-center"
        >
          {/* LEFT CONTENT */}
          <div className="lg:w-1/3 text-center lg:text-left space-y-3 mt-20">
            <p className="uppercase text-sm tracking-wide text-gray-600">
              Introducing
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold leading-tight bg-gradient-to-r from-[#FF8C42] to-[#E65100] bg-clip-text text-transparent">
              Braj Yatra
              <br /> Special Packages
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
              Curated spiritual journeys with guided darshan & premium comfort.
            </p>
          </div>

          {/* RIGHT */}
          <div
            className="lg:w-2/3 w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              ref={sliderRef}
              className="
                flex lg:grid lg:grid-cols-2 gap-6
                overflow-x-auto lg:overflow-visible
                scroll-smooth scrollbar-hide
              "
            >
              {tours.map((tour, i) => {
                const highlights = getHighlights(tour.itinerary);
                const image = tourImages[i % tourImages.length];

                return (
                  <Link
                    key={tour.id}
                    to={`/tours/${tour.slug}`}
                    className="
                     flex-shrink-0 w-[85%] sm:w-[70%] lg:w-full mx-auto bg-gradient-to-b from-white to-[#FFF9F2]
border border-[rgba(215,180,120,0.35)]
rounded-2xl
overflow-hidden
shadow-[0_12px_30px_rgba(120,85,40,0.15)]
hover:shadow-[0_18px_45px_rgba(120,85,40,0.22)]
hover:-translate-y-1
transition-all duration-300  rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1transition"
                  >
                    {/* IMAGE */}
                    <div className="relative h-44 sm:h-48 overflow-hiddenrelative h-44 sm:h-48">
                      <img
                        src={image}
                        alt={tour.title}
                        className="h-full w-full object-cover scale-[1.03]"
                      />
                      <span className=" absolute top-3 left-3 bg-gradient-to-r from-[#FFE0B2] to-[#FFCC80] text-[11px] font-semibold text-[#E65100] px-2.5 py-0.5 rounded-full">
                        {tour.duration}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-[#1F2937]">
                        {tour.title}
                      </h3>
                      <p className="text-sm text-[#4B5563] mt-1">
                        {tour.subtitle}
                      </p>

                      {/* HIGHLIGHTS */}
                      <ul className="mt-3 space-y-1 text-sm text-[#374151]">
                        {highlights.map((place) => (
                          <li key={place}>• {place}</li>
                        ))}
                      </ul>

                      {/* FOOTER */}
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm">
                          {" "}
                          <span className=" font-bold bg-gradient-to-r from-[#C9A24D] to-[#E6952A] bg-clip-text text-transparent">
                            ₹{tour.pricing.baseTour}/ person
                          </span>
                        </p>
                        <span className="text-sm font-semibold text-[#C9A24D]">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* DOTS */}
            <div className="lg:hidden flex justify-center gap-1.5 mt-3">
              {tours.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === index ? "bg-[#C9A24D]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxeStylePackageBanner;
