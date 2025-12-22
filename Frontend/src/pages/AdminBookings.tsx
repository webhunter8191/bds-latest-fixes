// import { useQuery, useQueryClient } from "react-query";
// import * as apiClient from "../api-client";

// import { HotelType } from "../../../backend/src/shared/types";

// // Define interfaces for type safety
// interface BookingType {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   checkIn: string;
//   checkOut: string;
//   category: 1 | 2 | 3 | 4 | 5 | 6 | 7; // Specific category types that match the keys in categories
//   roomsCount: number;
//   totalCost: number;
//   paymentOption?: string;
//   fullAmount?: number;
//   bookingId?: string;
// }

// // Extending HotelType to ensure compatibility with the API response
// type HotelWithBookings = HotelType & {
//   bookings?: BookingType[];
// };

// // Define the category map type with specific numeric keys
// type CategoryMap = {
//   1: string;
//   2: string;
//   3: string;
//   4: string;
//   5: string;
//   6: string;
//   7: string;
// };

// const AdminBookings = () => {
//   const queryClient = useQueryClient();

//   const {
//     data: hotelBookings,
//     isLoading,
//     error,
//   } = useQuery<HotelWithBookings[]>(
//     "fetchOwnerBookings",
//     apiClient.fetchHotelOwnerBookings,
//     {
//       retry: 2,
//       onError: (err) => console.error("Error fetching owner bookings:", err),
//     }
//   );

//   const categories: CategoryMap = {
//     1: "Double Bed AC",
//     2: "Double Bed Non AC",
//     3: "3 Bed AC",
//     4: "3 Bed Non AC",
//     5: "4 Bed AC",
//     6: "4 Bed Non AC",
//     7: "Community Hall",
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="w-16 h-16 border-4 border-[#6A5631] border-t-transparent rounded-full animate-spin"></div>
//         <span className="ml-4 text-xl font-medium text-gray-700">
//           Loading bookings data...
//         </span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 bg-gray-50">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-24 w-24 text-red-400"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//         <h2 className="text-3xl font-bold text-red-600 text-center">
//           Error Loading Bookings
//         </h2>
//         <p className="text-gray-700 text-lg text-center max-w-lg">
//           {(error as Error).message || "Failed to load hotel bookings"}
//         </p>
//         <button
//           onClick={() => queryClient.invalidateQueries("fetchOwnerBookings")}
//           className="mt-4 px-8 py-3 bg-[#6A5631] text-white font-semibold rounded-lg hover:bg-[#5A4728] transition shadow-md flex items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (
//     !hotelBookings ||
//     !Array.isArray(hotelBookings) ||
//     hotelBookings.length === 0
//   ) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 bg-gray-50">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-24 w-24 text-gray-300"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1.5}
//             d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
//           />
//         </svg>
//         <h2 className="text-3xl font-bold text-gray-700 text-center">
//           No Guest Bookings Found
//         </h2>
//         <p className="text-gray-500 text-center max-w-md text-lg">
//           You don't have any guest bookings for your hotels yet.
//         </p>
//         <a
//           href="/my-hotels"
//           className="mt-4 px-8 py-3 bg-[#6A5631] text-white font-semibold rounded-lg hover:bg-[#5A4728] transition shadow-md flex items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//             />
//           </svg>
//           View My Hotels
//         </a>
//       </div>
//     );
//   }

//   // Calculate total bookings across all hotels
//   const totalBookings = hotelBookings.reduce(
//     (total, hotel) => total + (hotel.bookings?.length || 0),
//     0
//   );

//   // Count hotels with active bookings
//   const hotelsWithBookings = hotelBookings.filter(
//     (hotel) => hotel.bookings && hotel.bookings.length > 0
//   ).length;

//   return (
//     <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-10 text-center text-gray-800 relative">
//         <span className="relative z-10">Hotel Guest Bookings</span>
//         <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-[#6A5631] rounded-full"></span>
//       </h1>

//       {/* Dashboard stats */}
//       <div className="max-w-7xl mx-auto mb-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Hotels</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {hotelBookings.length}
//                 </p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-blue-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {totalBookings}
//                 </p>
//               </div>
//               <div className="bg-green-50 p-3 rounded-lg">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-green-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">
//                   Hotels with Bookings
//                 </p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {hotelsWithBookings}
//                 </p>
//               </div>
//               <div className="bg-amber-50 p-3 rounded-lg">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-amber-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {hotelBookings.length > 0
//                     ? Math.round(
//                         (hotelsWithBookings / hotelBookings.length) * 100
//                       ) + "%"
//                     : "0%"}
//                 </p>
//               </div>
//               <div className="bg-purple-50 p-3 rounded-lg">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-6 w-6 text-purple-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 gap-10">
//           {hotelBookings.map((hotel, hotelIndex) => (
//             <div
//               key={hotelIndex}
//               className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
//             >
//               {/* Hotel Header with Image and Details */}
//               <div className="relative">
//                 {/* Hotel Image with Overlay - Centered */}
//                 <div className="flex flex-col items-center">
//                   <div className="w-full max-w-3xl h-64 overflow-hidden relative">
//                     <img
//                       src={
//                         hotel.imageUrl ||
//                         "https://placehold.co/1200x400?text=Hotel+Image"
//                       }
//                       alt={hotel.hotelName}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                       <div className="p-6 text-white z-10 text-center">
//                         <h2 className="text-3xl md:text-4xl font-bold mb-2">
//                           {hotel.hotelName}
//                         </h2>
//                         <p className="text-gray-200 text-lg">
//                           {hotel.location || "Location not specified"}
//                         </p>
//                         <div className="mt-3 flex justify-center">
//                           <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium flex items-center text-sm">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-4 w-4 mr-1.5"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             </svg>
//                             {hotel.bookings?.length || 0} Active Bookings
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hotel Details */}
//                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm py-2 px-4 rounded-lg shadow-md">
//                   <div className="flex items-center text-sm">
//                     <span className="font-medium text-gray-800">Owner:</span>
//                     <span className="ml-2 text-gray-600">
//                       {hotel.firstName || "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Hotel Info Section */}
//               <div className="px-6 py-4 border-b border-gray-100">
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Hotel Type</p>
//                     <p className="font-medium text-gray-800">
//                       {hotel.type || "Standard"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Rating</p>
//                     <div className="flex items-center justify-center">
//                       <span className="flex">
//                         {Array.from({ length: hotel.starRating || 0 }).map(
//                           (_, i) => (
//                             <svg
//                               key={i}
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-5 w-5 text-amber-400"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
//                             </svg>
//                           )
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Address</p>
//                     <p className="font-medium text-gray-800">
//                       {hotel.address || hotel.location || "Not specified"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {hotel.bookings && hotel.bookings.length > 0 ? (
//                 <div>
//                   {/* Desktop Table View */}
//                   <div className="hidden lg:block overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="bg-gray-50 text-left text-gray-600 text-sm uppercase">
//                           <th className="py-4 px-5 font-semibold">Guest</th>
//                           <th className="py-4 px-5 font-semibold">Email</th>
//                           <th className="py-4 px-5 font-semibold">Check-In</th>
//                           <th className="py-4 px-5 font-semibold">Check-Out</th>
//                           <th className="py-4 px-5 font-semibold">Room Type</th>
//                           <th className="py-4 px-5 font-semibold">Rooms</th>
//                           <th className="py-4 px-5 font-semibold">Payment</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {hotel.bookings.map(
//                           (booking: BookingType, index: number) => (
//                             <tr
//                               key={index}
//                               className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
//                             >
//                               <td className="py-4 px-5">
//                                 <div className="flex items-center">
//                                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6A5631] to-[#8B7442] flex items-center justify-center text-white font-bold mr-3">
//                                     {(
//                                       booking.firstName?.[0] ||
//                                       hotel.firstName?.[0] ||
//                                       "G"
//                                     ).toUpperCase()}
//                                   </div>
//                                   <div>
//                                     <p className="font-medium text-gray-800">
//                                       {booking.firstName || hotel.firstName}{" "}
//                                       {booking.lastName || hotel.lastName}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                       ID:{" "}
//                                       {booking.bookingId?.substring(0, 8) ||
//                                         "N/A"}
//                                     </p>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="py-4 px-5">
//                                 <p className="text-sm text-gray-600">
//                                   {booking.email || hotel.email}
//                                 </p>
//                               </td>
//                               <td className="py-4 px-5">
//                                 <div className="font-medium text-gray-800">
//                                   {new Date(booking.checkIn).toLocaleDateString(
//                                     undefined,
//                                     {
//                                       month: "short",
//                                       day: "numeric",
//                                       year: "numeric",
//                                     }
//                                   )}
//                                 </div>
//                               </td>
//                               <td className="py-4 px-5">
//                                 <div className="font-medium text-gray-800">
//                                   {new Date(
//                                     booking.checkOut
//                                   ).toLocaleDateString(undefined, {
//                                     month: "short",
//                                     day: "numeric",
//                                     year: "numeric",
//                                   })}
//                                 </div>
//                                 <div className="text-xs text-gray-500">
//                                   {Math.ceil(
//                                     (new Date(booking.checkOut).getTime() -
//                                       new Date(booking.checkIn).getTime()) /
//                                       (1000 * 60 * 60 * 24)
//                                   )}{" "}
//                                   nights
//                                 </div>
//                               </td>
//                               <td className="py-4 px-5">
//                                 <span className="inline-flex items-center">
//                                   <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
//                                   <span className="font-medium text-gray-800">
//                                     {booking.category in categories
//                                       ? categories[
//                                           booking.category as keyof CategoryMap
//                                         ]
//                                       : `Room Type ${booking.category}`}
//                                   </span>
//                                 </span>
//                               </td>
//                               <td className="py-4 px-5">
//                                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                   {booking.roomsCount}{" "}
//                                   {Number(booking.roomsCount) > 1
//                                     ? "rooms"
//                                     : "room"}
//                                 </span>
//                               </td>
//                               <td className="py-4 px-5">
//                                 <div>
//                                   <div className="flex items-center mb-1">
//                                     <span
//                                       className={`inline-block w-3 h-3 rounded-full mr-2 ${
//                                         booking.paymentOption === "partial"
//                                           ? "bg-yellow-500"
//                                           : "bg-green-500"
//                                       }`}
//                                     ></span>
//                                     <span className="font-bold text-gray-800">
//                                       ₹
//                                       {Math.round(
//                                         booking.totalCost
//                                       ).toLocaleString()}
//                                       <span
//                                         className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
//                                           booking.paymentOption === "partial"
//                                             ? "bg-yellow-100 text-yellow-800"
//                                             : "bg-green-100 text-green-800"
//                                         }`}
//                                       >
//                                         {booking.paymentOption === "partial"
//                                           ? "30% Paid"
//                                           : "Full Payment"}
//                                       </span>
//                                     </span>
//                                   </div>

//                                   {booking.paymentOption === "partial" &&
//                                     booking.fullAmount && (
//                                       <div className="ml-5 mt-1">
//                                         <div className="text-sm text-gray-600">
//                                           Total: ₹
//                                           {Math.round(
//                                             booking.fullAmount
//                                           ).toLocaleString()}
//                                         </div>
//                                         <div className="text-sm font-medium text-[#6A5631]">
//                                           Due at check-in: ₹
//                                           {Math.round(
//                                             booking.fullAmount * 0.7
//                                           ).toLocaleString()}
//                                         </div>
//                                       </div>
//                                     )}
//                                 </div>
//                               </td>
//                             </tr>
//                           )
//                         )}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Mobile/Tablet View - Card Based Layout */}
//                   <div className="lg:hidden">
//                     <div className="divide-y divide-gray-100">
//                       {hotel.bookings.map(
//                         (booking: BookingType, index: number) => (
//                           <div key={index} className="p-4">
//                             {/* Guest Info Row */}
//                             <div className="flex items-start justify-between mb-4">
//                               <div className="flex items-center">
//                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6A5631] to-[#8B7442] flex items-center justify-center text-white font-bold mr-3">
//                                   {(
//                                     booking.firstName?.[0] ||
//                                     hotel.firstName?.[0] ||
//                                     "G"
//                                   ).toUpperCase()}
//                                 </div>
//                                 <div>
//                                   <p className="font-medium text-gray-800">
//                                     {booking.firstName || hotel.firstName}{" "}
//                                     {booking.lastName || hotel.lastName}
//                                   </p>
//                                   <p className="text-sm text-gray-600">
//                                     {booking.email || hotel.email}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     ID:{" "}
//                                     {booking.bookingId?.substring(0, 8) ||
//                                       "N/A"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Booking Details */}
//                             <div className="bg-gray-50 rounded-lg p-3 mb-3">
//                               <div className="grid grid-cols-2 gap-3">
//                                 <div>
//                                   <p className="text-xs text-gray-500">
//                                     Check-In
//                                   </p>
//                                   <p className="font-medium text-gray-800">
//                                     {new Date(
//                                       booking.checkIn
//                                     ).toLocaleDateString(undefined, {
//                                       month: "short",
//                                       day: "numeric",
//                                       year: "numeric",
//                                     })}
//                                   </p>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-gray-500">
//                                     Check-Out
//                                   </p>
//                                   <p className="font-medium text-gray-800">
//                                     {new Date(
//                                       booking.checkOut
//                                     ).toLocaleDateString(undefined, {
//                                       month: "short",
//                                       day: "numeric",
//                                       year: "numeric",
//                                     })}
//                                   </p>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-gray-500">
//                                     Room Type
//                                   </p>
//                                   <div className="flex items-center">
//                                     <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
//                                     <span className="font-medium text-gray-800 text-sm">
//                                       {booking.category in categories
//                                         ? categories[
//                                             booking.category as keyof CategoryMap
//                                           ]
//                                         : `Room Type ${booking.category}`}
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-gray-500">
//                                     Stay Duration
//                                   </p>
//                                   <p className="font-medium text-gray-800">
//                                     {Math.ceil(
//                                       (new Date(booking.checkOut).getTime() -
//                                         new Date(booking.checkIn).getTime()) /
//                                         (1000 * 60 * 60 * 24)
//                                     )}{" "}
//                                     nights
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Booking Payment */}
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                   {booking.roomsCount}{" "}
//                                   {Number(booking.roomsCount) > 1
//                                     ? "rooms"
//                                     : "room"}
//                                 </span>
//                               </div>

//                               <div>
//                                 <div className="flex items-center">
//                                   <span
//                                     className={`inline-block w-3 h-3 rounded-full mr-2 ${
//                                       booking.paymentOption === "partial"
//                                         ? "bg-yellow-500"
//                                         : "bg-green-500"
//                                     }`}
//                                   ></span>
//                                   <span
//                                     className={`px-2.5 py-1 text-xs rounded-full ${
//                                       booking.paymentOption === "partial"
//                                         ? "bg-yellow-100 text-yellow-800"
//                                         : "bg-green-100 text-green-800"
//                                     } font-medium`}
//                                   >
//                                     {booking.paymentOption === "partial"
//                                       ? "30% Deposit"
//                                       : "Full Payment"}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Payment Details */}
//                             <div className="mt-3 border-t border-gray-100 pt-3">
//                               <div className="flex justify-between items-center">
//                                 <span className="text-sm text-gray-600">
//                                   Amount Paid:
//                                 </span>
//                                 <span className="font-bold text-gray-800">
//                                   ₹
//                                   {Math.round(
//                                     booking.totalCost
//                                   ).toLocaleString()}
//                                 </span>
//                               </div>

//                               {booking.paymentOption === "partial" &&
//                                 booking.fullAmount && (
//                                   <>
//                                     <div className="flex justify-between items-center mt-1">
//                                       <span className="text-sm text-gray-600">
//                                         Total Amount:
//                                       </span>
//                                       <span className="text-gray-800">
//                                         ₹
//                                         {Math.round(
//                                           booking.fullAmount
//                                         ).toLocaleString()}
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between items-center mt-1">
//                                       <span className="text-sm text-gray-600">
//                                         Due at check-in:
//                                       </span>
//                                       <span className="font-medium text-[#6A5631]">
//                                         ₹
//                                         {Math.round(
//                                           booking.fullAmount * 0.7
//                                         ).toLocaleString()}
//                                       </span>
//                                     </div>
//                                   </>
//                                 )}
//                             </div>
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-12 bg-gray-50/50">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-16 w-16 text-gray-300 mb-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                     />
//                   </svg>
//                   <p className="text-gray-500 text-center font-medium text-lg">
//                     No bookings found for this hotel.
//                   </p>
//                   <p className="text-gray-400 text-center max-w-md mt-2">
//                     When guests book rooms at this hotel, they will appear here.
//                   </p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminBookings;
