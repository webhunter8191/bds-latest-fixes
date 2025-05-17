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
      // Normalize nearbyTemple entries
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
      const roomImageUrls: Record<string, string[]> = {};
      
      // Process uploaded room images
      for (const file of roomImages) {
        const category = file.fieldname.split("roomImages")[1];
        if (!roomImageUrls[category]) {
          roomImageUrls[category] = [];
        }
        const imageUrl = await uploadImages([file]);
        roomImageUrls[category] = roomImageUrls[category].concat(imageUrl);
      }

      // Parse rooms data
      const roomsData = JSON.parse(req.body.rooms);
      let rooms = roomsData.map((room: any) => ({
        ...room,
        price: room.defaultPrice || room.price,
        defaultPrice: room.defaultPrice || room.price, // Ensure defaultPrice is set
        // Make sure features is always an array
        features: Array.isArray(room.features) ? room.features : [],
        // Set other defaults
        availableRooms: Number(room.totalRooms) || 0,
        adultCount: Number(room.adultCount) || 0,
        childCount: Number(room.childCount) || 0,
      }));

      console.log("Rooms data with features:", rooms.map((room: any) => ({
        category: room.category,
        features: room.features
      })));

      // Process rooms
      rooms = rooms.map((room: any) => {
        // Assign room images
        const categoryKey = room.category.toString();
        room.images = roomImageUrls[categoryKey] || [];

        // Ensure priceCalendar entries are properly formatted
        if (room.priceCalendar && Array.isArray(room.priceCalendar)) {
          room.priceCalendar = room.priceCalendar.map((entry: any) => ({
            ...entry,
            date: new Date(entry.date),
            price: Number(entry.price) || 0,
            availableRooms: Number(entry.availableRooms) || 0,
          }));
        } else {
          room.priceCalendar = []; // Default to empty array
        }

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

    // Ensure all room features are properly formatted arrays
    if (hotel?.rooms?.length) {
      hotel.rooms = hotel.rooms.map((room: any) => {
        if (!room.features) {
          room.features = [];
        } else if (typeof room.features === 'string') {
          try {
            room.features = JSON.parse(room.features);
            if (!Array.isArray(room.features)) {
              room.features = [room.features];
            }
          } catch (e) {
            room.features = [room.features];
          }
        } else if (!Array.isArray(room.features)) {
          // If it's an object but not an array
          room.features = Object.values(room.features);
        }
        
        // Remove any duplicate features
        if (Array.isArray(room.features)) {
          room.features = [...new Set(room.features)];
        }
        
        return room;
      });
      
      console.log("Normalized room features in my-hotels:", 
        hotel.rooms.map((room: any) => ({ 
          category: room.category, 
          features: room.features 
        }))
      );
    }

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

      // Get the existing hotel to preserve room data
      const existingHotel = await Hotel.findOne({ 
        _id: req.params.hotelId, 
        userId: req.userId 
      });
      
      if (!existingHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // Handle policies
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
      }
      
      // Process room images
      const roomImageUrls: Record<string, string[]> = {};
      
      // Process uploaded room images
      for (const file of roomImages) {
        const category = file.fieldname.split("roomImages")[1];
        if (!roomImageUrls[category]) {
          roomImageUrls[category] = [];
        }
        const imageUrl = await uploadImages([file]);
        roomImageUrls[category] = roomImageUrls[category].concat(imageUrl);
      }

      // Parse rooms data
      updatedHotel.rooms = JSON.parse(updatedHotel.rooms);
      
      // Log for debugging
      console.log("Updating rooms with features:", updatedHotel.rooms.map((room: any) => ({
        category: room.category,
        features: room.features
      })));

      // Process each room
      updatedHotel.rooms = updatedHotel.rooms.map((room: any) => {
        const categoryKey = room.category.toString();
        
        // Find matching existing room for data preservation
        const existingRoom = existingHotel.rooms.find(
          (r: any) => r.category.toString() === categoryKey
        );
        
        // Process features - ensure they're arrays
        if (room.features) {
          if (typeof room.features === 'string') {
            try {
              room.features = JSON.parse(room.features);
            } catch {
              room.features = [room.features];
            }
          }
          // Ensure features is an array and remove duplicates
          room.features = Array.isArray(room.features) 
            ? [...new Set(room.features.map((f: string) => f.trim()))]
            : [];
        } else if (existingRoom && existingRoom.features) {
          // Preserve existing features if none provided
          room.features = existingRoom.features;
        } else {
          room.features = [];
        }
        
        // Assign room images - use new uploads or preserve existing
        room.images = roomImageUrls[categoryKey] || 
          (existingRoom ? existingRoom.images : []);
          
        // Ensure numeric values
        room.adultCount = Number(room.adultCount) || 0;
        room.childCount = Number(room.childCount) || 0;
        room.totalRooms = Number(room.totalRooms) || 0;
        room.availableRooms = Number(room.availableRooms) || Number(room.totalRooms) || 0;
        room.defaultPrice = Number(room.defaultPrice) || 0;

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
            date: new Date(entry.date),
            price: Number(entry.price) || 0,
            availableRooms: Number(entry.availableRooms) || room.totalRooms || 0,
          }));
        } else if (existingRoom && existingRoom.priceCalendar) {
          // Preserve existing price calendar if none provided
          room.priceCalendar = existingRoom.priceCalendar;
        } else {
          room.priceCalendar = [];
        }

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
    totalCost: booking.totalCost,
    paymentOption: booking.paymentOption || 'full',
    fullAmount: booking.fullAmount || booking.totalCost
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
      totalCost: booking.totalCost,
      paymentOption: booking.paymentOption || 'full',
      fullAmount: booking.fullAmount || booking.totalCost
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
    const b64 = image.buffer.toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
