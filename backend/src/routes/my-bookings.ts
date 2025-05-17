import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";
import BookingModel from "../models/booking";
import UserModel from "../models/user";

const router = express.Router();

//  /api/my-bookings
router.get("/", 
  verifyToken,
  async (req: Request, res: Response) => {
  try {
    
    const userId = req.userId;
    const bookings = await BookingModel.find({ userId, deletedAt:null},{deletedAt:0,__v:0}).sort({ checkIn: -1 });    
    const hotelIds = bookings.map((booking) => booking.hotelId);    
    const userDetails = await UserModel.findOne({_id:userId},{mobNo:1,_id:0});
    const hotels = await Hotel.find({ _id: { $in: hotelIds } },{name:1,rooms:1,"imageUrls":1});    
    const data = bookings.map((booking) => {
      const hotel = hotels.find((hotel) => hotel._id.toString() === booking.hotelId);
      const rooms = hotel?.rooms.filter((room:any) => booking.roomsId.includes(room._id.toString()));      
      return {
        ...booking.toJSON(),
        hotelName: hotel?.name,
        roomsCount:booking?.rooms,
        imageUrl:hotel?.imageUrls[0],
        rooms,

      };
    });    

const finalData = data.map((booking) => {
   return {

    hotelName:booking.hotelName,
    firstName:booking.firstName,
    lastName:booking.lastName,
    email:booking.email,
    phone:userDetails?.mobNo,
    imageUrl:booking.imageUrl,
    bookings:booking?.rooms?.map((room:any) => {
      return {
        checkIn:booking.checkIn,
        checkOut:booking.checkOut,
        category:room.category,
        bookingId:booking._id,
        roomsCount:booking.roomsCount,
        totalCost:Math.abs(booking.totalCost),
        paymentOption: booking.paymentOption || 'full',
        fullAmount: booking.fullAmount || booking.totalCost
      }
    })
   }
})

// Group bookings by hotel name
const groupedData = finalData.reduce((acc: any, curr) => {
  const existingHotel = acc.find((hotel: any) => hotel.hotelName === curr.hotelName);
  if (!existingHotel) {
    acc.push({
      ...curr,
      bookings: curr.bookings || []
    });
  } else if (curr.bookings && curr.bookings.length > 0) {
    existingHotel.bookings.push(...curr.bookings);
  }
  
  return acc;
}, []);

    return res.status(200).json(groupedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

router.get("/:id", 
  verifyToken, 
  async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const booking = await BookingModel.findOne({ 
      _id: req.params.id,
      userId 
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const hotel = await Hotel.findById(booking.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    return res.status(200).json({ booking, hotel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch booking" });
  }
});

router.post("/booking/:hotelId", 
  verifyToken, 
  async (req: Request, res: Response) => {
  try {
    console.log("in booking route");
    
    const userId = req.userId;
    const hotelId = req.params.hotelId;
    const { firstName, lastName, email, checkIn, checkOut, totalCost, roomsId, roomCount, paymentOption, fullAmount } = req.body;
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
      paymentOption: paymentOption || 'full',
      fullAmount: fullAmount || totalCost
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
