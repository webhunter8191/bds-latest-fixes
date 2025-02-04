import React from "react";

interface Room {
  roomId: string;
  category: number;
  roombooked: number;
}

interface Booking {
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  rooms: Room[];
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: number;
  checkIn: string;
  checkOut: string;
  totalCost: number;
}

interface AdminBookingsProps {
  bookings: Booking[];
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings }) => {
  const defaultImage = "https://via.placeholder.com/400x200?text=Hotel+Image";
  
  // Group bookings by unique hotel identifier (hotelId + hotelName)
  const groupedBookings = bookings.reduce<{ [key: string]: Booking[] }>((acc, booking) => {
    const hotelKey = `${booking.hotelId}-${booking.hotelName}`;
    if (!acc[hotelKey]) {
      acc[hotelKey] = [];
    }
    acc[hotelKey].push(booking);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Hotel Bookings</h1>
      <div className="space-y-6">
        {Object.entries(groupedBookings).map(([hotelKey, hotelBookings]) => (
          <div key={hotelKey} className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col items-center">
            <img 
              src={hotelBookings[0].hotelImage || defaultImage} 
              alt={hotelBookings[0].hotelName} 
              className="w-full md:w-1/3 h-52 object-cover rounded-lg shadow-md mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">{hotelBookings[0].hotelName}</h2>
            <div className="mt-4 w-full">
              <div className="hidden md:block">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3">Guest</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Mobile</th>
                      <th className="p-3">Check-In</th>
                      <th className="p-3">Check-Out</th>
                      <th className="p-3">Rooms</th>
                      <th className="p-3">Total Cost</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelBookings.map((booking, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{booking.firstName} {booking.lastName}</td>
                        <td className="p-3">{booking.email}</td>
                        <td className="p-3">{booking.mobileNo}</td>
                        <td className="p-3">{new Date(booking.checkIn).toLocaleDateString()}</td>
                        <td className="p-3">{new Date(booking.checkOut).toLocaleDateString()}</td>
                        <td className="p-3">
                          {booking.rooms.map((room, i) => (
                            <div key={i}>
                              Room {room.roomId} (Category {room.category}) - {room.roombooked} booked
                            </div>
                          ))}
                        </td>
                        <td className="p-3 font-bold">₹{booking.totalCost}</td>
                        <td className="p-3">
                          <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                            Checkout
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden">
                {hotelBookings.map((booking, index) => (
                  <div key={index} className="border p-6 rounded-lg shadow-md bg-gray-100 mb-4">
                    <p className="font-semibold text-lg">Guest: {booking.firstName} {booking.lastName}</p>
                    <p className="text-gray-700">Email: {booking.email}</p>
                    <p className="text-gray-700">Mobile: {booking.mobileNo}</p>
                    <p className="text-gray-700">Check-In: {new Date(booking.checkIn).toLocaleDateString()}</p>
                    <p className="text-gray-700">Check-Out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                    <p className="font-semibold text-lg">Rooms:</p>
                    <div className="ml-4">
                      {booking.rooms.map((room, i) => (
                        <p key={i} className="text-gray-700">Room {room.roomId} (Category {room.category}) - {room.roombooked} booked</p>
                      ))}
                    </div>
                    <p className="font-bold text-xl">Total Cost: ₹{booking.totalCost}</p>
                    <button className="mt-4 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-full">
                      Checkout
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

export default AdminBookings;
