import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "";

const SuperAdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const categories = {
    1: "2 Bed AC",
    2: "2 Bed Non AC",
    3: "4 Bed AC",
    4: "4 Bed Non AC",
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch(`${API_URL}/api/my-hotels/admin/bookings/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const handleCheckout = async (bookingId: string) => {
    try {
      setCheckingOut(bookingId);
      await fetch(`${API_URL}/api/my-bookings/checkout/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      // Refetch bookings after checkout
      const response = await fetch(`${API_URL}/api/my-hotels/my-bookings/12`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error checking out:", error);
    } finally {
      setCheckingOut(null);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl font-semibold text-gray-600">
          No bookings found
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Hotel Bookings
      </h1>
      <div className="space-y-6">
        {bookings.map((hotel: any, hotelIndex: number) => (
          <div
            key={hotelIndex}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col items-center"
          >
            <img
              src={hotel.imageUrl}
              alt={hotel.hotelName}
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
                      <th className="p-3">Total Cost</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotel.bookings.map((booking: any, index: number) => (
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
                        <td className="p-3 font-bold">
                          ₹{Math.round(booking.totalCost)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleCheckout(booking.bookingId)}
                            disabled={checkingOut === booking.bookingId}
                            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-400"
                          >
                            {checkingOut === booking.bookingId
                              ? "Processing..."
                              : "Checkout"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden">
                {hotel.bookings.map((booking: any, index: number) => (
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
                      Check-In: {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      Check-Out:{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">
                      Category:{" "}
                      {categories[booking.category as keyof typeof categories]}
                    </p>
                    <p className="text-gray-700">
                      Rooms: {booking.roomsCount} room(s)
                    </p>
                    <p className="font-bold text-xl mt-2">
                      Total Cost: ₹{Math.round(booking.totalCost)}
                    </p>
                    <button
                      onClick={() => handleCheckout(booking.bookingId)}
                      disabled={checkingOut === booking.bookingId}
                      className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-full disabled:bg-blue-400"
                    >
                      {checkingOut === booking.bookingId
                        ? "Processing..."
                        : "Checkout"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminPanel;
