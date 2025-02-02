// // import { useQuery } from "react-query";
// // import { useParams } from "react-router-dom";
// // import * as apiClient from "./../api-client";
// // import { AiFillStar } from "react-icons/ai";
// // import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// // import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
// // import Slider from "react-slick";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // // Custom Next Arrow Component
// // const NextArrow = (props) => {
// //   const { onClick } = props;
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition duration-200 shadow-lg"
// //       style={{ zIndex: 1 }}
// //     >
// //       <FaArrowRight />
// //     </button>
// //   );
// // };

// // // Custom Prev Arrow Component
// // const PrevArrow = (props) => {
// //   const { onClick } = props;
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition duration-200 shadow-lg"
// //       style={{ zIndex: 1 }}
// //     >
// //       <FaArrowLeft />
// //     </button>
// //   );
// // };

// // const Detail = () => {
// //   const { hotelId } = useParams();

// //   const { data: hotel } = useQuery(
// //     ["fetchHotelById", hotelId],
// //     () => apiClient.fetchHotelById(hotelId || ""),
// //     {
// //       enabled: !!hotelId,
// //     }
// //   );

// //   if (!hotel) {
// //     return <></>;
// //   }

// //   // Slider settings with custom arrows
// //   const sliderSettings = {
// //     dots: true,
// //     infinite: true,
// //     speed: 500,
// //     slidesToShow: 1,
// //     slidesToScroll: 1,
// //     adaptiveHeight: true,
// //     nextArrow: <NextArrow />,
// //     prevArrow: <PrevArrow />,
// //   };

// //   return (
// //     <div className="space-y-12 p-6 bg-gray-50 min-h-screen">
// //       <div className="flex flex-col items-start gap-4">
// //         <div className="flex items-center gap-1">
// //           {Array.from({ length: hotel.starRating }).map((_, index) => (
// //             <AiFillStar
// //               key={index}
// //               className="fill-yellow-400 text-xl transition transform hover:scale-125"
// //             />
// //           ))}
// //           <span className="text-gray-500 text-sm">{hotel.type}</span>
// //         </div>
// //         <h1 className="text-4xl font-bold text-blue-800 animate-fadeIn">
// //           {hotel.name}
// //         </h1>
// //       </div>

// //       {/* Image Slider */}
// //       <div className="relative lg:w-4/5 mx-auto shadow-xl rounded-lg overflow-hidden">
// //         <Slider {...sliderSettings}>
// //           {hotel.imageUrls.map((image, index) => (
// //             <div key={index} className="h-[400px]">
// //               <img
// //                 src={image}
// //                 alt={hotel.name}
// //                 className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
// //               />
// //             </div>
// //           ))}
// //         </Slider>
// //       </div>

// //       {/* Facilities */}
// //       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
// //         {hotel.facilities.map((facility, index) => (
// //           <div
// //             key={index}
// //             className="border border-slate-300 rounded-md p-3 text-center bg-white shadow-md hover:bg-blue-50 transition duration-200 transform hover:scale-105"
// //           >
// //             {facility}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Description and Guest Info Form */}
// //       {/* Description and Guest Info Form */}
// // <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
// //   <div className="whitespace-pre-line text-gray-700 leading-relaxed animate-fadeIn">
// //     {hotel.description}
// //   </div>
// //   <div
// //     className={`p-6 border border-slate-200 rounded-md shadow-lg bg-white 
// //       lg:static lg:transform-none lg:shadow-lg transition-shadow duration-200 
// //       fixed bottom-0 left-0 right-0 z-10 md:sticky md:top-auto md:bottom-4`}
// //   >
// //     <GuestInfoForm
// //       pricePerNight={hotel.pricePerNight}
// //       hotelId={hotel._id}
// //     />
// //   </div>
// // </div>

// //     </div>
// //   );
// // };

// // export default Detail;





// // import { useQuery } from "react-query";
// // import { useParams } from "react-router-dom";
// // import * as apiClient from "./../api-client";
// // import { AiFillStar } from "react-icons/ai";
// // import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// // import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
// // import Slider from "react-slick";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // // Custom Next Arrow Component
// // const NextArrow = (props) => {
// //   const { onClick } = props;
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition duration-200 shadow-lg"
// //       style={{ zIndex: 1 }}
// //     >
// //       <FaArrowRight />
// //     </button>
// //   );
// // };

// // // Custom Prev Arrow Component
// // const PrevArrow = (props) => {
// //   const { onClick } = props;
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition duration-200 shadow-lg"
// //       style={{ zIndex: 1 }}
// //     >
// //       <FaArrowLeft />
// //     </button>
// //   );
// // };

// // const Detail = () => {
// //   const { hotelId } = useParams();

// //   const { data: hotel } = useQuery(
// //     ["fetchHotelById", hotelId],
// //     () => apiClient.fetchHotelById(hotelId || ""),
// //     {
// //       enabled: !!hotelId,
// //     }
// //   );

// //   if (!hotel) {
// //     return <></>;
// //   }

// //   // Slider settings with custom arrows
// //   const sliderSettings = {
// //     dots: true,
// //     infinite: true,
// //     speed: 500,
// //     slidesToShow: 1,
// //     slidesToScroll: 1,
// //     adaptiveHeight: true,
// //     nextArrow: <NextArrow />,
// //     prevArrow: <PrevArrow />,
// //   };

// //   return (
// //     <div className="space-y-12 p-0  min-h-screen">
// //       {/* Hotel Header */}
// //       <div className="flex flex-col items-start gap-4">
// //         <div className="flex items-center gap-1">
// //           {Array.from({ length: hotel.starRating }).map((_, index) => (
// //             <AiFillStar
// //               key={index}
// //               className="fill-yellow-400 text-xl transition transform hover:scale-125"
// //             />
// //           ))}
// //           <span className="text-gray-500 text-sm">{hotel.type}</span>
// //         </div>
// //         <h1 className="text-4xl font-bold text-blue-800 animate-fadeIn">
// //           {hotel.name}
// //         </h1>
// //       </div>

// //       {/* Image Slider */}
// //       <div className="relative  mx-auto shadow-xl rounded-lg overflow-hidden">
// //         <Slider {...sliderSettings}>
// //           {hotel.imageUrls.map((image, index) => (
// //             <div key={index} className="h-[600px]">
// //               <img
// //                 src={image}
// //                 alt={hotel.name}
// //                 className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
// //               />
// //             </div>
// //           ))}
// //         </Slider>
// //       </div>

// //       {/* Content Section */}
// //       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
// //         <div className="space-y-8">
// //           {/* Hotel Description */}
// //           <div className="bg-white shadow-md rounded-md p-6">
// //             <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
// //               About the Hotel
// //             </h2>
// //             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
// //               {hotel.description}
// //               </p>
// //           </div>

// //           {/* Facilities */}
// //           <div className="bg-white shadow-md rounded-md p-6">
// //             <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
// //               Amenities
// //             </h2>
// //             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
// //               {hotel.facilities.map((facility, index) => (
// //                 <div
// //                   key={index}
// //                   className="flex items-center gap-2 p-3 border rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
// //                 >
// //                   <span className="text-blue-600 font-medium text-lg">{facility}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Guest Info Form */}
// //         <div className="sticky top-4">
// //           <div className="p-6 border border-slate-200 rounded-md shadow-lg bg-white">
// //             <GuestInfoForm
// //               pricePerNight={hotel.pricePerNight}
// //               hotelId={hotel._id}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Detail;


// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Custom Next Arrow Component
// const NextArrow = (props: { onClick: any; }) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition duration-200 shadow-lg"
//       style={{ zIndex: 1 }}
//     >
//       <FaArrowRight />
//     </button>
//   );
// };

// // Custom Prev Arrow Component
// const PrevArrow = (props: { onClick: any; }) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition duration-200 shadow-lg"
//       style={{ zIndex: 1 }}
//     >
//       <FaArrowLeft />
//     </button>
//   );
// };

// const Detail = () => {
//   const { hotelId } = useParams();

//   const { data: hotel } = useQuery(
//     ["fetchHotelById", hotelId],
//     () => apiClient.fetchHotelById(hotelId || ""),
//     {
//       enabled: !!hotelId,
//     }
//   );

//   if (!hotel) {
//     return <></>;
//   }

//   // Slider settings with custom arrows
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow onClick={undefined} />,
//     prevArrow: <PrevArrow onClick={undefined} />,
//   };

//   return (
//     <div className="space-y-5 p-4 sm:p-6 mx-auto min-h-screen">
//       {/* Hotel Header */}
//       <div className="flex flex-col items-start gap-4">
//         <div className="flex items-center gap-1">
//           {Array.from({ length: hotel.starRating }).map((_, index) => (
//             <AiFillStar
//               key={index}
//               className="fill-yellow-400 text-xl transition transform hover:scale-125"
//             />
//           ))}
//           <span className="text-gray-500 text-sm">{hotel.type}</span>
//         </div>
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 animate-fadeIn">
//           {hotel.name}
//         </h1>
//       </div>

//       {/* Image Slider */}
//       <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden">
//         <Slider {...sliderSettings}>
//           {hotel.imageUrls.map((image, index) => (
//             <div key={index} className="h-[300px] sm:h-[400px] md:h-[400px] lg:h-[600px]">
//               <img
//                 src={image}
//                 alt={hotel.name}
//                 className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>

//       {/* Content Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
//         <div className="space-y-8">
//           {/* Hotel Description */}
//           <div className="bg-white shadow-md rounded-md p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               About the Hotel
//             </h2>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//               {hotel.description}

//             </p>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//               <a href= {hotel.location} target="_blank"> location</a>
              

//             </p>
//           </div>

//           {/* Facilities */}
//           <div className="bg-white shadow-md rounded-md p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               Amenities
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//               {hotel.facilities.map((facility, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-2 p-3 border rounded-md bg-blue-50 hover:bg-blue-100 transition duration-200"
//                 >
//                   <span className="text-blue-600 font-medium text-lg">
//                     {facility}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Guest Info Form */}
//         <div className="sticky top-4">
//           <div className="p-4 sm:p-6 border border-slate-200 rounded-md shadow-lg bg-white">
//             <GuestInfoForm
//               pricePerNight={hotel.pricePerNight}
//               hotelId={hotel._id}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Detail;

import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import { FaArrowLeft, FaArrowRight, FaWifi, FaSwimmingPool, FaConciergeBell, FaParking, FaDumbbell, FaCoffee, FaUtensils, FaSpa, FaHotel } from "react-icons/fa";
import { MdLocalLaundryService, MdOutlineRoomService } from "react-icons/md";
import { GiBathtub } from "react-icons/gi";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Facility to icon mapping
const facilityIcons = {
  "Free WiFi": FaWifi,
  "Swimming Pool": FaSwimmingPool,
  "Concierge Service": FaConciergeBell,
  "Parking": FaParking,
  "Gym": FaDumbbell,
  "Breakfast Included": FaCoffee,
  "Restaurant": FaUtensils,
  "Spa": FaSpa,
  "Laundry Service": MdLocalLaundryService,
  "Room Service": MdOutlineRoomService,
  "Bathtub": GiBathtub,
  "Hotel": FaHotel,
};

// Custom Next Arrow Component
const NextArrow = (props: { onClick: any; }) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 rounded-full text-xl text-white bg-black hover:bg-black transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowRight />
    </button>
  );
};

// Custom Prev Arrow Component
const PrevArrow = (props: { onClick: any; }) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2  p-3 rounded-full text-xl text-white bg-black hover:bg-blue-700 transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowLeft />
    </button>
  );
};

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const [selectedRooms, setSelectedRooms] = useState({ "2 Bed": "AC", "4 Bed": "AC" });

  const handleRoomSelection = (roomType: string, category: string) => {
    setSelectedRooms((prev) => {
      if (roomType === "2 Bed") {
        return { "2 Bed": category, "4 Bed": prev["4 Bed"] }; // Keep the "4 Bed" selection unchanged
      } else if (roomType === "4 Bed") {
        return { "2 Bed": prev["2 Bed"], "4 Bed": category }; // Keep the "2 Bed" selection unchanged
      }
      return prev;
    });
  };

  if (!hotel) {
    return <></>;
  }

  // Slider settings with custom arrows
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <NextArrow onClick={undefined} />,
    prevArrow: <PrevArrow onClick={undefined} />,
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 mx-auto min-h-screen">
      {/* Hotel Header */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar
              key={index}
              className="fill-yellow-400 text-xl transition transform hover:scale-125"
            />
          ))}
          <span className="text-gray-500 text-sm">{hotel.type}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 animate-fadeIn">
          {hotel.name}
        </h1>
      </div>

      {/* Image Slider */}
      <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden">
        <Slider {...sliderSettings}>
          {hotel.imageUrls.map((image, index) => (
            <div key={index} className="h-[300px] sm:h-[400px] md:h-[400px] lg:h-[600px]">
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        <div className="space-y-8">
          {/* Hotel Description */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              About the Hotel
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              <a href={hotel.location} target="_blank" className="text-blue-500 hover:underline">
                View on Map
              </a>
            </p>
          </div>

          {/* Facilities */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-6">
              {hotel.facilities.map((facility, index) => {
                const Icon = facilityIcons[facility as keyof typeof facilityIcons] || FaHotel; // Default to FaHotel if no match
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3  rounded-md transition duration-200"
                  >
                    <Icon className="text-blue-500 text-xl sm:text-xl lg:text-2xl" /> {/* Smaller icons on small screens */}
                    <span className="text-black-600 font-medium text-sm sm:text-base lg:text-md">
                      {facility}
                    </span> {/* Smaller text on small screens */}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid grid-rows-1 md:grid-cols-2 gap-6">
        {["2 Bed", "4 Bed"].map((roomType, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Room image on the left */}
            <div className="flex justify-center items-center">
              <img
                src={`https://via.placeholder.com/200x150?text=${roomType}+Room`} // Replace with actual room images
                alt={`${roomType} Room`}
                className="rounded-md w-full h-auto object-cover"
              />
            </div>

            {/* Room selection buttons and info on the right */}
            <div className="flex flex-col justify-start gap-4">
              <h3 className="text-lg font-semibold mb-4">{roomType} Room</h3>
              <div className="flex gap-4 mb-4">
                {["AC", "Non AC"].map((category, idx) => (
                  <button
                    key={idx}
                    className={`px-4 py-2 border rounded-lg transition ${selectedRooms[roomType] === category ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                    onClick={() => handleRoomSelection(roomType, category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Select {selectedRooms[roomType]} Room
              </button>
            </div>
          </div>
        ))}
      </div>
          {/* Location Section */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Location
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {hotel.location ? (
                  <>
                    <a
                      href={hotel.location}
                      target="_blank"
                      className="text-blue-500 hover:underline"
                    >
                      View the hotel on Google Maps
                    </a>
                  </>
                ) : (
                  "No location available."
                )}
              </p>
            </div>
            {/* Google Maps Embed */}
            {hotel.location && (
              <div className="w-full h-80 sm:h-96">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(hotel.location)}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                  className="w-full h-full border-none"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* Guest Info Form */}
        <div className="sticky top-4">
          <div className="p-4 sm:p-6 border border-slate-200 rounded-lg shadow-lg bg-white">
            <GuestInfoForm
              pricePerNight={hotel.pricePerNight}
              hotelId={hotel._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;



// import { useState } from "react";
// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
// import { FaArrowLeft, FaArrowRight, FaWifi, FaSwimmingPool, FaConciergeBell, FaParking, FaDumbbell, FaCoffee, FaUtensils, FaSpa, FaHotel } from "react-icons/fa";
// import { MdLocalLaundryService, MdOutlineRoomService } from "react-icons/md";
// import { GiBathtub } from "react-icons/gi";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const facilityIcons = {
//   "Free WiFi": FaWifi,
//   "Swimming Pool": FaSwimmingPool,
//   "Concierge Service": FaConciergeBell,
//   "Parking": FaParking,
//   "Gym": FaDumbbell,
//   "Breakfast Included": FaCoffee,
//   "Restaurant": FaUtensils,
//   "Spa": FaSpa,
//   "Laundry Service": MdLocalLaundryService,
//   "Room Service": MdOutlineRoomService,
//   "Bathtub": GiBathtub,
//   "Hotel": FaHotel,
// };

// const NextArrow = (props: { onClick: any; }) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 rounded-full text-xl text-white bg-black hover:bg-black transition duration-200 shadow-lg"
//       style={{ zIndex: 1 }}
//     >
//       <FaArrowRight />
//     </button>
//   );
// };

// const PrevArrow = (props: { onClick: any; }) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 rounded-full text-xl text-white bg-black hover:bg-blue-700 transition duration-200 shadow-lg"
//       style={{ zIndex: 1 }}
//     >
//       <FaArrowLeft />
//     </button>
//   );
// };

// const Detail = () => {
//   const { hotelId } = useParams();
//   const { data: hotel } = useQuery(
//     ["fetchHotelById", hotelId],
//     () => apiClient.fetchHotelById(hotelId || ""),
//     { enabled: !!hotelId }
//   );

//   const [selectedRooms, setSelectedRooms] = useState({ "2 Bed": "AC", "4 Bed": "AC" });

//   const handleRoomSelection = (roomType: string, category: string) => {
//     setSelectedRooms((prev) => {
//       if (roomType === "2 Bed") {
//         return { "2 Bed": category, "4 Bed": prev["4 Bed"] }; // Keep the "4 Bed" selection unchanged
//       } else if (roomType === "4 Bed") {
//         return { "2 Bed": prev["2 Bed"], "4 Bed": category }; // Keep the "2 Bed" selection unchanged
//       }
//       return prev;
//     });
//   };

//   if (!hotel) {
//     return <></>;
//   }

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     adaptiveHeight: true,
//     nextArrow: <NextArrow onClick={undefined} />,
//     prevArrow: <PrevArrow onClick={undefined} />,
//   };

//   return (
//     <div className="space-y-5 p-4 sm:p-6 mx-auto min-h-screen">
//       <div className="flex flex-col items-start gap-4">
//         <div className="flex items-center gap-1">
//           {Array.from({ length: hotel.starRating }).map((_, index) => (
//             <AiFillStar
//               key={index}
//               className="fill-yellow-400 text-xl transition transform hover:scale-125"
//             />
//           ))}
//           <span className="text-gray-500 text-sm">{hotel.type}</span>
//         </div>
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 animate-fadeIn">
//           {hotel.name}
//         </h1>
//       </div>

//       <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden">
//         <Slider {...sliderSettings}>
//           {hotel.imageUrls.map((image, index) => (
//             <div key={index} className="h-[300px] sm:h-[400px] md:h-[400px] lg:h-[600px]">
//               <img
//                 src={image}
//                 alt={hotel.name}
//                 className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>
      


//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {["2 Bed", "4 Bed"].map((roomType, index) => (
//           <div key={index} className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Room image on the left */}
//             <div className="flex justify-center items-center">
//               <img
//                 src={`https://via.placeholder.com/200x150?text=${roomType}+Room`} // Replace with actual room images
//                 alt={`${roomType} Room`}
//                 className="rounded-md w-full h-auto object-cover"
//               />
//             </div>

//             {/* Room selection buttons and info on the right */}
//             <div className="flex flex-col justify-start gap-4">
//               <h3 className="text-lg font-semibold mb-4">{roomType} Room</h3>
//               <div className="flex gap-4 mb-4">
//                 {["AC", "Non AC"].map((category, idx) => (
//                   <button
//                     key={idx}
//                     className={`px-4 py-2 border rounded-lg transition ${selectedRooms[roomType] === category ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
//                     onClick={() => handleRoomSelection(roomType, category)}
//                   >
//                     {category}
//                   </button>
//                 ))}
//               </div>
//               <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
//                 Select {selectedRooms[roomType]} Room
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Detail;
