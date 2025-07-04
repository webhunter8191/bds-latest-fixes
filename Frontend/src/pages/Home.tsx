import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import room1img from "../assets/room1.jpg";
import room2img from "../assets/room2.jpg";
import room3img from "../assets/room3.jpg";

const Home = () => {
  const { data: hotels, error } = useQuery(
    "fetchHotels",
    apiClient.fetchHotels
  );

  useEffect(() => {
    console.log("Hotels data:", hotels);
    console.log("Error:", error);
  }, [hotels, error]);

  const MAX_HOTELS = 5;
  const sortedHotels = hotels
    ? [...hotels].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
    : [];

  const limitedHotels = sortedHotels.slice(0, MAX_HOTELS);

  const topRowHotels = limitedHotels.slice(0, 2);
  const bottomRowHotels = limitedHotels.slice(2);

  // Track loading state
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    if (limitedHotels.length > 0 && loadedImages === limitedHotels.length) {
      setLoading(false);
    }
  }, [loadedImages, limitedHotels.length]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000); // Fallback after 5 seconds

    return () => clearTimeout(timeout);
  }, [limitedHotels.length]);

  return (
    <div className="bg-[#f0efed]">
      {/* Hero Section */}
      <div className="relative ">
        <div className="md:mb-20">
          <Hero />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 w-[85%] md:w-[80%] lg:w-[80%] bottom-[-100px]  lg:bottom-[-40px]">
          <SearchBar />
        </div>
      </div>

      {/* Latest Destinations Section */}
      <section className="container mx-auto px-4 py-8 space-y-6 mt-[80px] w-[100%] md:w-[80%] lg:w-[80%] relative">
        <h2 className="text-4xl font-bold text-gray-800 text-center">
          Latest Hotels
        </h2>
        <p className="text-lg text-gray-600 text-center">
          Discover our recently added Hotels and plan your stay
        </p>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center ">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mt-20"></div>
          </div>
        )}

        {/* Cards Section */}
        <div
          className={`${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500 space-y-4`}
        >
          <div className="grid md:grid-cols-2 grid-cols-2 md:gap-6 gap-3">
            {topRowHotels.map((hotel) => (
              <LatestDestinationCard
                key={hotel._id}
                hotel={hotel}
                onImageLoad={() => {
                  console.log(`Image loaded for hotel: ${hotel._id}`);
                  setLoadedImages((prev) => prev + 1);
                }}
              />
            ))}
          </div>
          <div className="grid md:grid-cols-3 grid-cols-3 lg:gap-5 gap-3">
            {bottomRowHotels.map((hotel) => (
              <LatestDestinationCard
                key={hotel._id}
                hotel={hotel}
                onImageLoad={() => {
                  console.log(`Image loaded for hotel: ${hotel._id}`);
                  setLoadedImages((prev) => prev + 1);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Automatic Slider for Rooms */}
      <section className="relative py-12 px-6 md:px-12 bg-gray-100">
        <div className="absolute inset-0 bg-[#6A5631] opacity-20"></div>

        <div className="relative text-center mb-8 z-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            Luxurious Rooms
          </h2>
          <p className="text-gray-600">
            All rooms are designed for your comfort
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[Autoplay, Pagination]}
          className="relative w-full max-w-6xl mx-auto z-10 pb-12 px-2"
        >
          <SwiperSlide>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-xs mx-auto">
              <img
                src={room1img}
                alt="Room 1"
                className="w-full h-52 sm:h-64 object-cover rounded-lg"
              />

              {/* <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                3 Rooms available
              </span> */}
              <p className="mt-3 text-gray-700">
                Television set, Extra sheets and Breakfast
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-xs mx-auto">
              <img
                src={room2img}
                alt="Room 2"
                className="w-full h-52 sm:h-64 object-cover rounded-lg"
              />
              {/* <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                4 Rooms available
              </span> */}
              <p className="mt-3 text-gray-700">
                Television set, Extra sheets, Breakfast, and Fireplace
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full max-w-xs mx-auto">
              <img
                src={room3img}
                alt="Room 3"
                className="w-full h-52 sm:h-64 object-cover rounded-lg"
              />
              {/* <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                6 Rooms available
              </span> */}
              <p className="mt-3 text-gray-700">
                Television set, Extra sheets, Breakfast, Fireplace, Console, and
                bed rest
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </div>
  );
};

export default Home;
