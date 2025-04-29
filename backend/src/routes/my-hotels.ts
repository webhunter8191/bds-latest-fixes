import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import BookingModel from "../models/booking";
import UserModel from "../models/user";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).any();

router.post(
  "/",
  verifyToken,
  upload,
  async (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
      // Normalize nearbyTemple entries
=======
      // Normalize the nearbyTemple entries
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
      if (req.body.nearbyTemple) {
        req.body.nearbyTemple = req.body.nearbyTemple.map((temple: string) =>
          temple.trim().replace(/\s+/g, " ").toLowerCase()
        );
      }

      const files = req.files as Express.Multer.File[];
      const hotelImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("imageFiles")
      );
      const roomImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("roomImages")
      );

      const newHotel = req.body;

      // ✅ Handle policies
      if (newHotel.policies) {
        if (typeof newHotel.policies === "string") {
          try {
            const parsed = JSON.parse(newHotel.policies);
            newHotel.policies = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            newHotel.policies = [newHotel.policies];
          }
<<<<<<< HEAD
        } else if (!Array.isArray(newHotel.policies)) {
          newHotel.policies = [newHotel.policies];
        }
      }

      // ✅ Handle temples (name and distance)
      if (newHotel.temples) {
        if (typeof newHotel.temples === "string") {
          try {
            const parsed = JSON.parse(newHotel.temples);
            newHotel.temples = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return res.status(400).json({ message: "Invalid temples format" });
          }
        }
      }

      // Upload hotel images
      const imageUrls = await uploadImages(hotelImages);

      // Upload room images
=======
        } else if (Array.isArray(newHotel.policies)) {
          newHotel.policies = newHotel.policies;
        }
      }
    
      const imageUrls = await uploadImages(hotelImages);
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
      const roomImageUrls = await Promise.all(
        roomImages.map(async (file) => {
          const roomImage = await uploadImages([file]);
          return {
            category: file.fieldname.split("roomImages")[1],
            images: roomImage,
          };
        })
      );

<<<<<<< HEAD
      // Parse rooms data
      newHotel.rooms = JSON.parse(newHotel.rooms);

      // Process rooms
      const rooms = newHotel.rooms.map((room: any) => {
        // Assign room images
=======
      newHotel.imageUrls = imageUrls;
      newHotel.rooms = JSON.parse(newHotel.rooms);

      const rooms = newHotel.rooms.map((room: any) => {
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
        room.images =
          roomImageUrls.find(
            (roomImage: any) => roomImage.category == room.category
          )?.images || [];
<<<<<<< HEAD

        // Set availableRooms to totalRooms
        room.availableRooms = room.totalRooms;

        // Ensure adultCount and childCount are numbers
        room.adultCount = Number(room.adultCount) || 0;
        room.childCount = Number(room.childCount) || 0;

        // Handle priceCalendar
        if (room.priceCalendar) {
          if (typeof room.priceCalendar === "string") {
            try {
              room.priceCalendar = JSON.parse(room.priceCalendar);
            } catch {
              return res
                .status(400)
                .json({ message: "Invalid priceCalendar format" });
            }
          }

          // Validate priceCalendar entries
          room.priceCalendar = room.priceCalendar.map((entry: any) => ({
            date: new Date(entry.date), // Convert to Date object
            price: Number(entry.price), // Ensure price is a number
          }));
        } else {
          room.priceCalendar = []; // Default to empty array
        }

        // Ensure defaultPrice is present
        room.defaultPrice = Number(room.defaultPrice) || 0;

        return room;
      });

      // Assign processed rooms
      newHotel.rooms = rooms;

      // Assign uploaded hotel images
      newHotel.imageUrls = imageUrls;

      // Set lastUpdated and userId
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      // Create and save the hotel
      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).json({
        message: "Hotel created successfully",
        data: hotel,
      });
    } catch (e) {
      console.error(e);
=======
        room.availableRooms = room.totalRooms;

        // Ensure adultCount and childCount are included
        room.adultCount = Number(room.adultCount) || 0;
        room.childCount = Number(room.childCount) || 0;

        return room;
      });

      newHotel.rooms = rooms;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res
        .status(201)
        .json({ message: "Hotel created successfully", data: hotel });
    } catch (e) {
      console.log(e);
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload,
  async (req: Request, res: Response) => {
    try {
      const updatedHotel = req.body;
      updatedHotel.rooms = JSON.parse(updatedHotel.rooms);
      updatedHotel.lastUpdated = new Date();

      const files = req.files as Express.Multer.File[];
      const hotelImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("imageFiles")
      );
      const roomImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("roomImages")
      );

      const updatedImageUrls = await uploadImages(hotelImages);
      updatedHotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      

      if (updatedHotel.policies) {
        if (typeof updatedHotel.policies === "string") {
          try {
            const parsed = JSON.parse(updatedHotel.policies);
            updatedHotel.policies = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            updatedHotel.policies = [updatedHotel.policies];
          }
        } else if (!Array.isArray(updatedHotel.policies)) {
          updatedHotel.policies = [updatedHotel.policies];
        }
      
        // Fetch existing hotel to preserve existing policies
        const existingHotel = await Hotel.findOne({ _id: req.params.hotelId, userId: req.userId });
        if (existingHotel) {
          // Don't merge, just replace
updatedHotel.policies = updatedHotel.policies;

        }
      }
      const roomImageUrls = await Promise.all(
        roomImages.map(async (file) => {
          const roomImage = await uploadImages([file]);
          return {
            category: file.fieldname.split("roomImages")[1],
            images: roomImage,
          };
        })
      );

      updatedHotel.rooms = updatedHotel.rooms.map((room: any) => {
        room.images =
          roomImageUrls.find(
            (roomImage: any) => roomImage.category == room.category
          )?.images ||
          updatedHotel.rooms.find(
            (existingRoom: any) => existingRoom.category == room.category
          )?.images ||
          [];

        // Ensure adultCount and childCount are included
        room.adultCount = Number(room.adultCount) || 0;
        room.childCount = Number(room.childCount) || 0;

        return room;
      });

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      return res.status(201).json(hotel);
    } catch (error) {
      console.log("error is", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/my-bookings/:userId",
  verifyToken,
   async (req: Request, res: Response) => {
  try{
    const userId = req.userId; 
    const hotelData = await Hotel.find({userId},{name:1,rooms:1,imageUrls:1});
          
    if(!hotelData){
      return res.status(404).json({ message: "Hotel not found" });
    }
    const hotelIds = hotelData.map((hotel:any)=>hotel._id.toString());
    const bookings = await BookingModel.find({hotelId:{$in:hotelIds},deletedAt:null},{hotelId:0, __v:0}).lean();

const userIds = [...new Set(bookings.map((booking: any) => booking.userId))];
const userData = await UserModel.find({_id:{$in:userIds}},{mobNo:1});
const groupedBookings = bookings.reduce((acc: any, booking: any) => {
  const roomId = booking.roomsId[0];
  const hotel = hotelData.find((h: any) => 
    h.rooms.some((r: any) => r._id.toString() === roomId)
  );
  const user = userData.find((u: any) => u._id.toString() === booking.userId);
  
  const hotelName = hotel?.name || '';
  if (!acc[hotelName]) {
    acc[hotelName] = {
      hotelName,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: user?.mobNo,
      imageUrl: hotel?.imageUrls?.[0] || '',
      bookings: []
    };
  }
  const room = hotel?.rooms.find((r: any) => r._id.toString() === roomId);  
  acc[hotelName].bookings.push({
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    category: (room as any)?.category,
    bookingId: booking._id.toString(),
    roomsCount: booking.roomsId.length.toString(),
    totalCost: booking.totalCost
  });

  return acc;
}, {});

// Transform the groupedBookings object into an array
const bookingsArray = Object.values(groupedBookings);
    return res.status(200).json(bookingsArray);
  }
  catch(error){
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch bookings" });
  }
})

router.get("/admin/bookings",
  verifyToken,
  async(req:Request,res:Response)=>{
  try{
    const hotelData = await Hotel.find({},{name:1,rooms:1,imageUrls:1});
    if(!hotelData){
      return res.status(404).json({ message: "Hotel not found" });
    }
    const hotelIds = hotelData.map((hotel:any)=>hotel._id.toString());
    const bookings = await BookingModel.find({hotelId:{$in:hotelIds},deletedAt:null},{hotelId:0, __v:0}).lean();
    const userIds = [...new Set(bookings.map((booking: any) => booking.userId))];
    const userData = await UserModel.find({_id:{$in:userIds}},{mobNo:1});
    const groupedBookings = bookings.reduce((acc: any, booking: any) => {
    const roomId = booking.roomsId[0];
    const hotel = hotelData.find((h: any) => 
      h.rooms.some((r: any) => r._id.toString() === roomId)
    );
    const user = userData.find((u: any) => u._id.toString() === booking.userId);
  
    const hotelName = hotel?.name || '';
    if (!acc[hotelName]) {
      acc[hotelName] = {
        hotelName,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: user?.mobNo,
        imageUrl: hotel?.imageUrls?.[0] || '',
        bookings: []
      };
    }
    const room = hotel?.rooms.find((r: any) => r._id.toString() === roomId);  
    acc[hotelName].bookings.push({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      category: (room as any)?.category,
      bookingId: booking._id.toString(),
      roomsCount: booking.roomsId.length.toString(),
      totalCost: booking.totalCost
    });
  
    return acc;
}, {});

// Transform the groupedBookings object into an array
  const bookingsArray = Object.values(groupedBookings);
      return res.status(200).json(bookingsArray);
    }catch(error){
      console.log(error);
      return res.status(500).json({ message: "Unable to fetch hotels" });
    }
  })

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
<<<<<<< HEAD
    const b64 = image.buffer.toString("base64");
=======
    const b64 = Buffer.from(image.buffer).toString("base64");
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
