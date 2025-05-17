import { useQuery, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const MyBookings = () => {
  const queryClient = useQueryClient();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const { data: hotelBookings, isLoading } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

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
    return <span className="text-xl text-center">Loading...</span>;
  }

  if (!hotelBookings || hotelBookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl font-semibold text-gray-600">
          No bookings found
        </span>
      </div>
    );
  }

  const handleCheckout = async (bookingId: string) => {
    try {
      setCheckingOut(bookingId);
      await fetch(`${API_BASE_URL}/api/my-bookings/checkout/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      queryClient.invalidateQueries("fetchMyBookings");
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setCheckingOut(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        My Hotel Bookings
      </h1>
      <div className="space-y-6">
        {hotelBookings.map((hotel, hotelIndex) => (
          <div
            key={hotelIndex}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col items-center"
          >
            <img
              src={hotel?.imageUrl}
              alt={hotel?.hotelName}
              className="w-full md:w-1/3 h-52 object-cover rounded-lg shadow-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              {hotel.hotelName}
            </h2>
            <div className="mt-4 w-full">
              <div className="hidden md:block">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3">Guest</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Check-In</th>
                      <th className="p-3">Check-Out</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Rooms</th>
                      <th className="p-3">Payment Info</th>
                      <th className="p-3">Action</th>
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
                        <tr key={index} className="border-b">
                          <td className="p-3">
                            {hotel.firstName} {hotel.lastName}
                          </td>
                          <td className="p-3">{hotel.email}</td>
                          <td className="p-3">{hotel.phone}</td>
                          <td className="p-3">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            {
                              categories[
                                booking.category as keyof typeof categories
                              ]
                            }
                          </td>
                          <td className="p-3">{booking.roomsCount}</td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-bold">
                                ₹{Math.round(booking.totalCost)}
                                {booking.paymentOption === "partial"
                                  ? " (30%)"
                                  : ""}
                              </span>
                              {booking.paymentOption === "partial" &&
                                booking.fullAmount && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    <div>
                                      Total: ₹{Math.round(booking.fullAmount)}
                                    </div>
                                    <div className="text-[#6A5631]">
                                      Due at check-in: ₹
                                      {Math.round(booking.fullAmount * 0.7)}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() =>
                                booking?.bookingId &&
                                handleCheckout(booking.bookingId)
                              }
                              disabled={checkingOut === booking?.bookingId}
                              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                            >
                              {checkingOut === booking.bookingId
                                ? "Processing..."
                                : "Checkout"}
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden">
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
                        | ReactElement<any, string | JSXElementConstructor<any>>
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
                      className="border p-6 rounded-lg shadow-md bg-gray-100 mb-4"
                    >
                      <p className="font-semibold text-lg">
                        Guest: {hotel.firstName} {hotel.lastName}
                      </p>
                      <p className="text-gray-700">Email: {hotel.email}</p>
                      <p className="text-gray-700">Phone: {hotel.phone}</p>
                      <p className="text-gray-700">
                        Check-In:{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        Check-Out:{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        Category: {categories[booking.category]}
                      </p>
                      <p className="text-gray-700">
                        Rooms: {booking.roomsCount} room(s)
                      </p>

                      {/* Payment Information */}
                      <div className="mt-3 border-t border-gray-300 pt-3">
                        <p className="text-gray-700 font-medium">
                          Payment Information:
                        </p>
                        <p className="font-bold text-lg">
                          Paid: ₹{Math.round(booking.totalCost)}
                          {booking.paymentOption === "partial"
                            ? " (30% Deposit)"
                            : " (Full Payment)"}
                        </p>

                        {booking.paymentOption === "partial" &&
                          booking.fullAmount && (
                            <div className="text-sm text-gray-700">
                              <p>
                                Total Amount: ₹{Math.round(booking.fullAmount)}
                              </p>
                              <p className="text-[#6A5631] font-medium">
                                Due at check-in: ₹
                                {Math.round(booking.fullAmount * 0.7)}
                              </p>
                            </div>
                          )}
                      </div>

                      <button
                        onClick={() =>
                          booking.bookingId && handleCheckout(booking.bookingId)
                        }
                        disabled={checkingOut === booking.bookingId}
                        className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-full disabled:bg-blue-400"
                      >
                        {checkingOut === booking.bookingId
                          ? "Processing..."
                          : "Checkout"}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
