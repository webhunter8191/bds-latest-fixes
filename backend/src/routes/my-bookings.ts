import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import BookingModel from "../models/booking";

const router = express.Router();

//  /api/my-bookings
router.get("/", 
  verifyToken,
  async (req: Request, res: Response) => {
  try {
    
    const userId = req.userId;
    const bookings = await BookingModel.find({ userId, deletedAt:null }).sort({ checkIn: -1 });
    console.log("bookings", bookings);
    
    const hotelIds = bookings.map((booking) => booking.hotelId);
    console.log("hotelIds", hotelIds);
    
    const hotels = await Hotel.find({ _id: { $in: hotelIds } },{name:1,rooms:1});    
    const data = bookings.map((booking) => {
      const hotel = hotels.find((hotel) => hotel._id.toString() === booking.hotelId);
      return {
        ...booking.toJSON(),
        hotelName: hotel?.name,
        rooms:booking?.rooms,
      };
    });    
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

router.post("/booking/:hotelId", 
  verifyToken, 
  async (req: Request, res: Response) => {
  try {
    console.log("in booking route");
    
    const userId = req.userId;
    const hotelId = req.params.hotelId;
    const { firstName, lastName, email, checkIn, checkOut, totalCost, roomsId, roomCount } = req.body;
    console.log("in booking route", req.body);


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

    const rooms = roomCount;

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
      rooms,

    };

    const data = await BookingModel.create(booking);
    await Hotel.updateOne({_id : hotelId, "rooms._id":{$in:roomsId}},{$inc:{"rooms.$.availableRooms":-rooms}});
    return res.status(200).json({ "message":"booking created successfully", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to create booking" });
  }
});
// for normal user
router.patch("/checkout/:bookingId",
  // verifyToken, 
  async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await BookingModel
      .findOne({ _id: bookingId,deletedAt:null },{hotelId:1,roomsId:1,rooms:1});
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await BookingModel.updateOne({ _id: bookingId }, {deletedAt:new Date()});
    await Hotel.updateOne({_id : booking.hotelId, "rooms._id":{$in:booking.roomsId}},{$inc:{"rooms.$.availableRooms":booking.rooms}});
    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to cancel booking" });
  }
}
);

export default router;
