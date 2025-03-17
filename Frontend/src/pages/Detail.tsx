// import { useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaWifi,
//   FaSwimmingPool,
//   FaConciergeBell,
//   FaParking,
//   FaDumbbell,
//   FaCoffee,
//   FaUtensils,
//   FaSpa,
//   FaHotel,
// } from "react-icons/fa";

// import { MdLocalLaundryService, MdOutlineRoomService } from "react-icons/md";
// import { GiBathtub } from "react-icons/gi";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Facility to icon mapping
// const facilityIcons = {
//   "Free WiFi": FaWifi,
//   "Swimming Pool": FaSwimmingPool,
//   "Concierge Service": FaConciergeBell,
//   Parking: FaParking,
//   Gym: FaDumbbell,
//   "Breakfast Included": FaCoffee,
//   Restaurant: FaUtensils,
//   Spa: FaSpa,
//   "Laundry Service": MdLocalLaundryService,
//   "Room Service": MdOutlineRoomService,
//   Bathtub: GiBathtub,
//   Hotel: FaHotel,
// };

// // Custom Next Arrow Component
// const NextArrow = (props: { onClick: any }) => {
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

// // Custom Prev Arrow Component
// const PrevArrow = (props: { onClick: any }) => {
//   const { onClick } = props;
//   return (
//     <button
//       onClick={onClick}
//       className="absolute top-1/2 left-4 transform -translate-y-1/2  p-3 rounded-full text-xl text-white bg-black hover:bg-[#6A5631]-700 transition duration-200 shadow-lg"
//       style={{ zIndex: 1 }}
//     >
//       <FaArrowLeft />
//     </button>
//   );
// };

// const Detail = () => {
//   const { hotelId } = useParams();
//   const [isLoading, setIsLoading] = useState(true);

//   const { data: hotel, isFetching } = useQuery(
//     ["fetchHotelById", hotelId],
//     () => apiClient.fetchHotelById(hotelId || ""),
//     {
//       enabled: !!hotelId,
//       onSuccess: () => setIsLoading(false),
//     }
//   );

//   useEffect(() => {
//     setIsLoading(true);
//   }, [hotelId]);

//   const categories = {
//     1: "Double Bed AC",
//     2: "Double Bed Non AC",
//     3: "4 Bed AC",
//     4: "4 Bed Non AC",
//   };

//   const [selectedRooms, setSelectedRooms] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [selectedRoomPrice, setSelectedRoomPrice] = useState<number>(0);
//   const [availableRooms, setAvailableRooms] = useState<number>(0);
//   const [selectedRoomId, setSelectedRoomId] = useState<string>("");

//   const handleRoomSelection = (
//     availableRooms: number,
//     category: string,
//     price: number,
//     roomId: string
//   ) => {
//     setSelectedRooms((prev) => {
//       // If clicking the same room that's already selected, unselect it
//       if (prev[category]) {
//         return {};
//       }
//       // Otherwise, clear all selections and select the new room
//       return {
//         [category]: true,
//       };
//     });

//     // If we're selecting a new room
//     if (!selectedRooms[category]) {
//       setAvailableRooms(availableRooms);
//       setSelectedRoomPrice(price);
//       setSelectedRoomId(roomId);
//     } else {
//       // If we're unselecting the current room
//       setAvailableRooms(0);
//       setSelectedRoomPrice(0);
//       setSelectedRoomId("");
//     }
//   };

//   if (isLoading || isFetching) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="loader"></div>
//       </div>
//     );
//   }

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
//       {/* Image Slider */}
//       <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden">
//         <Slider {...sliderSettings}>
//           {hotel.imageUrls.map((image, index) => (
//             <div
//               key={index}
//               className="h-[250px] sm:h-[250px] md:h-[200px] lg:h-[600px]"
//             >
//               <img
//                 src={image}
//                 alt={hotel.name}
//                 className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>

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
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black animate-fadeIn">
//           {hotel.name} near {hotel.nearbyTemple[0]}
//         </h1>
//       </div>

//       {/* Content Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
//         <div className="space-y-8">
//           {/* Hotel Description */}
//           <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               About the Hotel
//             </h2>
//             <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//               {hotel.description}
//             </p>
//           </div>

//           {/* Facilities */}
//           <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               Amenities
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-6">
//               {hotel.facilities.map((facility, index) => {
//                 const Icon =
//                   facilityIcons[facility as keyof typeof facilityIcons] ||
//                   FaHotel; // Default to FaHotel if no match
//                 return (
//                   <div
//                     key={index}
//                     className="flex items-center gap-3 p-3  rounded-md transition duration-200"
//                   >
//                     <Icon className="text-[#6A5631] text-xl sm:text-xl lg:text-2xl" />{" "}
//                     {/* Smaller icons on small screens */}
//                     <span className="text-black-600 font-medium text-sm sm:text-base lg:text-md">
//                       {facility}
//                     </span>{" "}
//                     {/* Smaller text on small screens */}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <div className="grid grid-rows-1 md:grid-cols-2 gap-6">
//             {hotel.rooms.map((room: any, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-1 gap-4"
//               >
//                 {/* Room image on the left */}
//                 <div className="flex justify-center ">
//                   <img
//                     src={room.images[0]}
//                     alt={`${room.type} Room`}
//                     className="rounded-md w-full h-fit object-cover"
//                   />
//                 </div>
//                 <div></div>
//                 {/* Room selection buttons and info on the right */}
//                 <div className="flex flex-col justify-start gap-4">
//                   <h3 className="text-lg font-semibold mb-4">
//                     {categories[room.category as keyof typeof categories]}
//                   </h3>
//                   <div className="text-gray-600">
//                     <p>Price: ₹ {room.price}/night</p>
//                     <p>Available Rooms: {room.availableRooms}</p>
//                   </div>

//                   <button
//                     onClick={() =>
//                       handleRoomSelection(
//                         room.availableRooms,
//                         room.category,
//                         room.price,
//                         room._id
//                       )
//                     }
//                     className="w-full bg-[#6A5631] text-white py-2 rounded-lg hover:bg-[#6A5631]"
//                   >
//                     {selectedRooms[room.category]
//                       ? "Unselect Room"
//                       : "Select Room"}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Location Section */}
//           <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
//               Location
//             </h2>
//             <div className="mb-4">
//               <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                 {hotel.location ? (
//                   <>
//                     <a
//                       href={hotel.location}
//                       target="_blank"
//                       className="text-[#6A5631] hover:underline"
//                     >
//                       View the hotel on Google Maps
//                     </a>
//                   </>
//                 ) : (
//                   "No location available."
//                 )}
//               </p>
//             </div>
//             {/* Google Maps Embed */}
//             {hotel.location && (
//               <div className="w-full h-80 sm:h-96">
//                 <iframe
//                   src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
//                     hotel.location
//                   )}&key=AIzaSyBFoJNp6RW84aL_Apk3j2CufrcS967Oy1o`}
//                   className="w-full h-full border-none"
//                   allowFullScreen
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Guest Info Form */}
//         <div className="sticky top-4">
//           <div className="p-4 sm:p-6 border border-slate-200 rounded-lg shadow-lg bg-white">
//             <GuestInfoForm
//               pricePerNight={selectedRoomPrice}
//               availableRooms={availableRooms}
//               roomsId={selectedRoomId}
//               hotelId={hotel._id}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Detail;

import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
// import { AiFillStar } from "react-icons/ai";
import {
  FaArrowLeft,
  FaArrowRight,
  FaWifi,
  FaSwimmingPool,
  FaConciergeBell,
  FaParking,
  FaDumbbell,
  FaCoffee,
  FaUtensils,
  FaSpa,
  FaHotel,
} from "react-icons/fa";
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
  Parking: FaParking,
  Gym: FaDumbbell,
  "Breakfast Included": FaCoffee,
  Restaurant: FaUtensils,
  Spa: FaSpa,
  "Laundry Service": MdLocalLaundryService,
  "Room Service": MdOutlineRoomService,
  Bathtub: GiBathtub,
  Hotel: FaHotel,
};

// Custom Arrow Components
const NextArrow = (props: { onClick: any }) => {
  return (
    <button
      onClick={props.onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 rounded-full text-xl text-white bg-black hover:bg-black transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowRight />
    </button>
  );
};

const PrevArrow = (props: { onClick: any }) => {
  return (
    <button
      onClick={props.onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2  p-3 rounded-full text-xl text-white bg-black hover:bg-black transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowLeft />
    </button>
  );
};

const Detail = () => {
  const { hotelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const { data: hotel, isFetching } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
      onSuccess: () => setIsLoading(false),
      onSettled: () => setIsLoading(false),
    }
  );

  useEffect(() => {
    setIsLoading(true);
  }, [hotelId]);

  const categories = {
    1: "Double Bed AC",
    2: "Double Bed Non AC",
    3: "4 Bed AC",
    4: "4 Bed Non AC",
  };

  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedRoomPrice, setSelectedRoomPrice] = useState<number>(0);
  const [availableRooms, setAvailableRooms] = useState<number>(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const handleRoomSelection = (
    availableRooms: number,
    category: string,
    price: number,
    roomId: string
  ) => {
    setSelectedRooms((prev) => {
      if (prev[category]) return {};
      return { [category]: true };
    });

    if (!selectedRooms[category]) {
      setAvailableRooms(availableRooms);
      setSelectedRoomPrice(price);
      setSelectedRoomId(roomId);
    } else {
      setAvailableRooms(0);
      setSelectedRoomPrice(0);
      setSelectedRoomId("");
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hotel) {
    return <p className="text-center text-gray-500">Hotel not found.</p>;
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
      {/* Image Slider */}
      <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden">
        <Slider {...sliderSettings}>
          {hotel.imageUrls.map((image, index) => (
            <div
              key={index}
              className="h-[250px] sm:h-[250px] md:h-[200px] lg:h-[600px]"
            >
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Hotel Details */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-8">
          {/* Hotel Description */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              About the Hotel
            </h2>
            <p className="text-gray-700">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {hotel.facilities.map((facility, index) => {
                const Icon =
                  facilityIcons[facility as keyof typeof facilityIcons] ||
                  FaHotel;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className="text-[#6A5631] text-xl" />
                    <span className="text-black-600 font-medium">
                      {facility}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Room Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotel.rooms.map((room: any, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">
                  {categories[room.category as keyof typeof categories]}
                </h3>
                <p>Price: ₹ {room.price}/night</p>
                <p>Available Rooms: {room.availableRooms}</p>
                <button
                  onClick={() =>
                    handleRoomSelection(
                      room.availableRooms,
                      room.category,
                      room.price,
                      room._id
                    )
                  }
                  className="w-full bg-[#6A5631] text-white py-2 rounded-lg"
                >
                  {selectedRooms[room.category]
                    ? "Unselect Room"
                    : "Select Room"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Info Form */}
        <div className="sticky top-4 p-4 border border-slate-200 rounded-lg shadow-lg bg-white">
          <GuestInfoForm
            pricePerNight={selectedRoomPrice}
            availableRooms={availableRooms}
            roomsId={selectedRoomId}
            hotelId={hotel._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
