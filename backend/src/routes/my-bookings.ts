import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import BookingModel from "../models/booking";

const router = express.Router();

// /api/my-bookings
// router.get("/", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const hotels = await Hotel.find({
//       bookings: { $elemMatch: { userId: req.userId } },
//     });

//     const results = hotels.map((hotel) => {
//       const userBookings = hotel.bookings.filter(
//         (booking) => booking.userId === req.userId
//       );

//       const hotelWithUserBookings: HotelType = {
//         ...hotel.toObject(),
//         bookings: userBookings,
//       };

//       return hotelWithUserBookings;
//     });

//     res.status(200).send(results);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Unable to fetch bookings" });
//   }
// });

router.post("/booking", async (req: Request, res: Response) => {
  try {
    // const userId = req.userId;
    const userId='678a87c5a90a33eebae907a5';
    const { firstName, lastName, email, checkIn, checkOut, hotelId, totalCost, roomsId } = req.body;

    // Validate request payload
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: "Invalid check-in or check-out date." });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if a booking already exists for the user with overlapping dates
    // const existingBooking = hotel.bookings.find(
    //   (booking) =>
    //     booking.userId === userId &&
    //     ((checkInDate >= new Date(booking.checkIn) && checkInDate <= new Date(booking.checkOut)) ||
    //       (checkOutDate >= new Date(booking.checkIn) && checkOutDate <= new Date(booking.checkOut)))
    // );

    // if (existingBooking) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "A booking already exists for the selected dates.",
    //   });
    // }

    // Add the new booking
    const booking = {
      firstName,
      lastName,
      email,
      roomsId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      hotelId,
      userId,
      totalCost,
    };

    const data = await BookingModel.create(booking);
    await Hotel.updateOne({_id : hotelId, "rooms._id":{$in:roomsId}},{$set:{"rooms.$.status":"booked"}});
    return res.status(200).json({ "message":"booking created successfully", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to create booking" });
  }
});

export default router;
