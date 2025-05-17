import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";

const MyBookings = () => {
  const { data: hotelBookings, isLoading } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  console.log("Hotel bookings data:", hotelBookings);

  const categories = {
    1: "Double Bed AC",
    2: "Double Bed Non AC",
    3: "3 Bed AC",
    4: "3 Bed Non AC",
    5: "4 Bed AC",
    6: "4 Bed Non AC",
    7: "Community Hall",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-[#6A5631] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-4 text-xl font-medium text-gray-700">
          Loading your bookings...
        </span>
      </div>
    );
  }

  if (!hotelBookings || hotelBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 bg-gray-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h2 className="text-3xl font-bold text-gray-700 text-center">
          No Bookings Found
        </h2>
        <p className="text-gray-500 text-center max-w-md text-lg">
          You haven't made any bookings yet. Browse hotels and make your first
          reservation!
        </p>
        <a
          href="/"
          className="mt-2 px-8 py-3 bg-[#6A5631] text-white font-medium rounded-lg hover:bg-[#5A4728] transition-colors shadow-md"
        >
          Browse Hotels
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800 relative">
        <span className="relative z-10">My Hotel Bookings</span>
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#6A5631] rounded-full"></span>
      </h1>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-10">
          {hotelBookings.map((hotel, hotelIndex) => (
            <div
              key={hotelIndex}
              className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100"
            >
              <div className="overflow-hidden h-56 md:h-72 relative">
                <img
                  src={
                    hotel?.imageUrl ||
                    "https://placehold.co/600x400?text=Hotel+Image"
                  }
                  alt={hotel?.hotelName}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {hotel.hotelName}
                    </h2>
                    <p className="text-gray-200 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {hotel.location ||
                        hotel.address ||
                        "Location information unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex flex-wrap gap-2">
                  {" "}
                  <span className="px-3 py-1 bg-[#f8f6f0] text-[#6A5631] text-sm font-medium rounded-full">
                    {" "}
                    {hotel.bookings?.length || 0} Booking{" "}
                    {hotel.bookings?.length !== 1 ? "s" : ""}{" "}
                  </span>{" "}
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                    {" "}
                    {hotel.starRating || 3} Stars{" "}
                  </span>{" "}
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                    {" "}
                    {hotel.roomCount || 0} Rooms{" "}
                  </span>{" "}
                  {hotel.address && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full flex items-center">
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {" "}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />{" "}
                      </svg>{" "}
                      {hotel.address}{" "}
                    </span>
                  )}{" "}
                </div>{" "}
                {(hotel.location || hotel.address) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-[#6A5631] mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
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
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          Address
                        </h3>
                        <p className="text-gray-700 mb-2">
                          {hotel.location || hotel.address}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            hotel.location || hotel.address || ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6A5631] hover:underline inline-flex items-center gap-2"
                        >
                          View on Google Maps
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <div className="w-full mb-6 rounded-lg overflow-hidden shadow border border-gray-200">
                  {" "}
                  <GoogleMapLocation
                    location={hotel.location || hotel.address || ""}
                  />{" "}
                </div>
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-100">
                  {/* Desktop View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#6A5631] to-[#8B7442] text-white">
                          <th className="py-4 px-5 text-left font-semibold">
                            Stay Period
                          </th>
                          <th className="py-4 px-5 text-left font-semibold">
                            Room Type
                          </th>
                          <th className="py-4 px-5 text-left font-semibold">
                            Units
                          </th>
                          <th className="py-4 px-5 text-left font-semibold">
                            Payment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.bookings?.map(
                          (
                            booking: {
                              checkIn: string | number | Date;
                              checkOut: string | number | Date;
                              category: number;
                              roomsCount:
                                | string
                                | number
                                | boolean
                                | ReactElement<
                                    any,
                                    string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | null
                                | undefined;
                              totalCost: number;
                              bookingId: string | null;
                              paymentOption?: "full" | "partial";
                              fullAmount?: number;
                            },
                            index: Key | null | undefined
                          ) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-5">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-[#F8F6F0] flex items-center justify-center mr-3">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-[#6A5631]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {new Date(
                                        booking.checkIn
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                      })}{" "}
                                      -{" "}
                                      {new Date(
                                        booking.checkOut
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {Math.ceil(
                                        (new Date(booking.checkOut).getTime() -
                                          new Date(booking.checkIn).getTime()) /
                                          (1000 * 60 * 60 * 24)
                                      )}{" "}
                                      nights
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5">
                                <span className="inline-flex items-center">
                                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                                  <span className="font-medium text-gray-800">
                                    {
                                      categories[
                                        booking.category as keyof typeof categories
                                      ]
                                    }
                                  </span>
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {booking.roomsCount}{" "}
                                  {Number(booking.roomsCount) > 1
                                    ? "rooms"
                                    : "room"}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <span
                                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                        booking.paymentOption === "partial"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                    ></span>
                                    <span className="font-bold text-gray-800">
                                      ₹
                                      {Math.round(
                                        booking.totalCost
                                      ).toLocaleString()}
                                      <span
                                        className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                          booking.paymentOption === "partial"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {booking.paymentOption === "partial"
                                          ? "30% Paid"
                                          : "Full Payment"}
                                      </span>
                                    </span>
                                  </div>

                                  {booking.paymentOption === "partial" &&
                                    booking.fullAmount && (
                                      <div className="ml-5 mt-1">
                                        <div className="text-sm text-gray-600">
                                          Total: ₹
                                          {Math.round(
                                            booking.fullAmount
                                          ).toLocaleString()}
                                        </div>
                                        <div className="text-sm font-medium text-[#6A5631]">
                                          Due at check-in: ₹
                                          {Math.round(
                                            booking.fullAmount * 0.7
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile and Tablet View */}
                  <div className="lg:hidden">
                    {hotel.bookings.map(
                      (
                        booking: {
                          checkIn: string | number | Date;
                          checkOut: string | number | Date;
                          category: keyof typeof categories;
                          roomsCount:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | null
                            | undefined;
                          totalCost: number;
                          bookingId: string | null;
                          paymentOption?: "full" | "partial";
                          fullAmount?: number;
                        },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="p-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#F8F6F0] flex items-center justify-center mr-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-[#6A5631]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {new Date(booking.checkIn).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}{" "}
                                  -{" "}
                                  {new Date(
                                    booking.checkOut
                                  ).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {Math.ceil(
                                    (new Date(booking.checkOut).getTime() -
                                      new Date(booking.checkIn).getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  nights
                                </p>
                              </div>
                            </div>

                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {booking.roomsCount}{" "}
                              {Number(booking.roomsCount) > 1
                                ? "rooms"
                                : "room"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="inline-flex items-center">
                              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                              <span className="font-medium text-gray-800">
                                {categories[booking.category]}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  booking.paymentOption === "partial"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                              ></span>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  booking.paymentOption === "partial"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {booking.paymentOption === "partial"
                                  ? "30% Paid"
                                  : "Full Payment"}
                              </span>
                            </div>
                          </div>

                          {/* Payment Information */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-600">
                                Amount Paid:
                              </p>
                              <p className="font-bold text-gray-800">
                                ₹
                                {Math.round(booking.totalCost).toLocaleString()}
                              </p>
                            </div>

                            {booking.paymentOption === "partial" &&
                              booking.fullAmount && (
                                <>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-gray-600">
                                      Total Amount:
                                    </p>
                                    <p className="text-gray-800">
                                      ₹
                                      {Math.round(
                                        booking.fullAmount
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center mt-1">
                                    <p className="text-sm text-gray-600">
                                      Due at check-in:
                                    </p>
                                    <p className="font-medium text-[#6A5631]">
                                      ₹
                                      {Math.round(
                                        booking.fullAmount * 0.7
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Replace the GoogleMapLocation component with a simplified version that uses iframe
const GoogleMapLocation = ({ location }: { location: string }) => {
  // Only render if we have a location
  if (!location) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-600">No location available</p>
        </div>
      </div>
    );
  }

  // Use iframe approach which is working in Detail page
  return (
    <div className="relative">
      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBfdU1HrvqgUUy-rsXNbvqCJRdQGMshjEE&q=${encodeURIComponent(
            location
          )}`}
          className="w-full h-full border-none"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm py-1.5 px-3 rounded-lg z-10 shadow-sm">
        <div className="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#6A5631]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-xs font-medium text-gray-700">{location}</span>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            location
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#6A5631] hover:bg-[#5A4728] text-white text-sm py-1 px-3 rounded-lg shadow-sm flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default MyBookings;
