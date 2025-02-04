import AdminBookings from "../components/AdminBookings"

const mockBookings = [
    {
      hotelId: "679dac7b4fac0999b1c8580f",
      hotelName: "GLA HOTEL",
      hotelImage: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rooms: [
        { roomId: "857894378", category: 1, roombooked: 2 },
        { roomId: "857894379", category: 2, roombooked: 1 }
      ],
      userId: "678a87c5a90a33eebae907a5",
      firstName: "Mohit",
      lastName: "Kumar",
      email: "monu@gmail.com",
      mobileNo: 90374897348,
      checkIn: "2025-01-29T00:00:00.000Z",
      checkOut: "2025-01-30T00:00:00.000Z",
      totalCost: 3000,
    },
    {
      hotelId: "679dac7b4fac0999b1c8580f",
      hotelName: "GLA HOTEL",
      hotelImage: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rooms: [
        { roomId: "857894378", category: 1, roombooked: 2 },
        { roomId: "857894379", category: 2, roombooked: 1 }
      ],
      userId: "678a87c5a90a33eebae907a5",
      firstName: "Mohit",
      lastName: "Kumar",
      email: "monu@gmail.com",
      mobileNo: 90374897348,
      checkIn: "2025-01-29T00:00:00.000Z",
      checkOut: "2025-01-30T00:00:00.000Z",
      totalCost: 3000,
    },
    {
      hotelId: "679dac74fac0999b1c8580f",
      hotelName: "raj hotel",
      hotelImage: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rooms: [
        { roomId: "857894378", category: 1, roombooked: 2 },
        { roomId: "857894379", category: 2, roombooked: 1 }
      ],
      userId: "678a87c5a90a33eebae907a5",
      firstName: "Mohit",
      lastName: "Kumar",
      email: "monu@gmail.com",
      mobileNo: 90374897348,
      checkIn: "2025-01-29T00:00:00.000Z",
      checkOut: "2025-01-30T00:00:00.000Z",
      totalCost: 3000,
    },
    {
      hotelId: "679dac7b4fac0999b1c8580f",
      hotelName: "Sunrise Inn",
      hotelImage: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rooms: [
        { roomId: "45364578", category: 3, roombooked: 1 }
      ],
      userId: "678a87c5a90a33eebae907b8",
      firstName: "Amit",
      lastName: "Sharma",
      email: "amit@gmail.com",
      mobileNo: 9876543210,
      checkIn: "2025-02-10T00:00:00.000Z",
      checkOut: "2025-02-12T00:00:00.000Z",
      totalCost: 5000,
    }
  ];
const AdminBookingspage = () => {
  return (
    <div>
      <AdminBookings bookings={mockBookings}/>
    </div>
  )
}

export default AdminBookingspage
