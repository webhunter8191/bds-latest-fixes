// // import { useQuery } from "react-query";
// // import * as apiClient from "../api-client";
// // import LatestDestinationCard from "../components/LastestDestinationCard";
// // import Hero from "../components/Hero";
// // import SearchBar from "../components/SearchBar";

// // const Home = () => {
// //   const { data: hotels } = useQuery("fetchHotels", apiClient.fetchHotels);

// //   const topRowHotels = hotels?.slice(0, 2) || [];
// //   const bottomRowHotels = hotels?.slice(2) || [];

// //   return (
// //     <div>
// //       {/* Hero Section */}
// //       <div className="relative">
// //         <Hero />

// //         {/* Search Bar Overlapping Hero */}
// //         <div className="absolute left-0 right-0 mx-auto bottom-[-0px] z-10 w-[90%] md:w-[90%] lg:w-[90%]">
// //           <SearchBar />
// //         </div>
// //       </div>

// //       {/* Latest Destinations Section */}
// //       <section className="container mx-auto px-4 py-8 space-y-6 mt-[80px]">
// //         <h2 className="text-4xl font-bold text-gray-800 text-center">
// //           Latest Destinations
// //         </h2>
// //         <p className="text-lg text-gray-600 text-center">
// //           Discover our recently added destinations and plan your next stay
// //         </p>

// //         <div className="space-y-8">
// //           <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
// //             {topRowHotels.map((hotel) => (
// //               <LatestDestinationCard key={hotel._id} hotel={hotel} />
// //             ))}
// //           </div>
// //           <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
// //             {bottomRowHotels.map((hotel) => (
// //               <LatestDestinationCard key={hotel._id} hotel={hotel} />
// //             ))}
// //           </div>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default Home;


// import { useQuery } from "react-query";
// import * as apiClient from "../api-client";
// import LatestDestinationCard from "../components/LastestDestinationCard";
// import Hero from "../components/Hero";
// import SearchBar from "../components/SearchBar";

// const Home = () => {
//   const { data: hotels } = useQuery("fetchHotels", apiClient.fetchHotels);

//   // Limit the number of hotels displayed (e.g., 5 hotels total)
//   const MAX_HOTELS = 5;
//   const limitedHotels = hotels?.slice(0, MAX_HOTELS) || [];

//   const topRowHotels = limitedHotels.slice(0, 2);
//   const bottomRowHotels = limitedHotels.slice(2);

//   return (
//     <div>
//   {/* Hero Section */}
//   <div className="relative">
//     <Hero />

//     {/* Search Bar Overlapping Hero */}
//     <div className="absolute left-1/2 transform -translate-x-1/2 z-10  w-[80%] md:w-[80%] lg:w-[80%] bottom-[-100px] sm:bottom-[10px] md:bottom-[-60px] lg:bottom-[-40px]">
//       <SearchBar />
//     </div>
//   </div>

//   {/* Latest Destinations Section */}
//   <section className="container mx-auto px-4 py-8 space-y-6 mt-[80px] w-[100%] md:w-[80%] lg:w-[85%]">
//     <h2 className="text-4xl font-bold text-gray-800 text-center">
//       Latest Destinations
//     </h2>
//     <p className="text-lg text-gray-600 text-center">
//       Discover our recently added destinations and plan your next stay
//     </p>

//     <div className="space-y-8">
//       <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
//         {topRowHotels.map((hotel) => (
//           <LatestDestinationCard key={hotel._id} hotel={hotel} />
//         ))}
//       </div>
//       <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
//         {bottomRowHotels.map((hotel) => (
//           <LatestDestinationCard key={hotel._id} hotel={hotel} />
//         ))}
//       </div>
//     </div>
//   </section>
// </div>

//   );
// };

// export default Home;








import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const { data: hotels } = useQuery("fetchHotels", apiClient.fetchHotels);

  // Limit the number of hotels displayed (e.g., 5 hotels total)
  const MAX_HOTELS = 5;
  const limitedHotels = hotels?.slice(0, MAX_HOTELS) || [];

  const topRowHotels = limitedHotels.slice(0, 2);
  const bottomRowHotels = limitedHotels.slice(2);

  // Track loading state for Latest Destinations section
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    if (limitedHotels.length > 0 && loadedImages === limitedHotels.length) {
      setLoading(false);
    }
  }, [loadedImages, limitedHotels.length]);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        <Hero />

        {/* Search Bar Overlapping Hero */}
        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 w-[80%] md:w-[80%] lg:w-[80%] bottom-[-100px] sm:bottom-[10px] md:bottom-[-60px] lg:bottom-[-40px]">
          <SearchBar />
        </div>
      </div>

      {/* Latest Destinations Section */}
      <section className="container mx-auto px-4 py-8 space-y-6 mt-[80px] w-[100%] md:w-[80%] lg:w-[85%] relative">
        <h2 className="text-4xl font-bold text-gray-800 text-center">
          Latest Destinations
        </h2>
        <p className="text-lg text-gray-600 text-center">
          Discover our recently added destinations and plan your next stay
        </p>

        {/* Loader Overlay (Covers Latest Destinations Section Only) */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Cards Section */}
        <div className={`${loading ? "opacity-0" : "opacity-100"} transition-opacity duration-500 space-y-8`}>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            {topRowHotels.map((hotel) => (
              <LatestDestinationCard
                key={hotel._id}
                hotel={hotel}
                onImageLoad={() => setLoadedImages((prev) => prev + 1)}
              />
            ))}
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {bottomRowHotels.map((hotel) => (
              <LatestDestinationCard
                key={hotel._id}
                hotel={hotel}
                onImageLoad={() => setLoadedImages((prev) => prev + 1)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

