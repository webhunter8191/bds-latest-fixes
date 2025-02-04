import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const {
    data: bookings,
    isLoading,
    // error,
  } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);  
  // Loading and Error handling
  if (isLoading) {
    return <span className="text-xl text-center">Loading...</span>;
  }

  // No bookings found
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-2xl font-semibold text-gray-600">
          No bookings found
        </span>
      </div>
    );
  }

  // Format the dates
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toDateString();
  };

  return (
    <div className="space-y-5 p-5">
      <h1 className="text-3xl font-bold text-center mb-6">My Bookings</h1>
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg shadow-lg p-8 gap-5 mb-6 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="lg:w-full lg:h-[250px]">
            {/* <img
              src={booking.imageUrls[0]}
              alt={booking.hotelName}
              className="w-full h-full object-cover object-center rounded-lg"
            /> */}
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-gray-800">
              {booking.hotelName}
            </div>
            <div className="mt-3">
              <div>
                <span className="font-semibold text-gray-700 mr-2">Dates:</span>
                <span className="text-gray-600">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 mr-2">Rooms:</span>
                <span className="text-gray-600">{booking.rooms} rooms</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 mr-2">Guest:</span>
                <span className="text-gray-600">
                  {booking.firstName} {booking.lastName}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 mr-2">Total Cost:</span>
                <span className="text-gray-600">
                ₹{booking.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
