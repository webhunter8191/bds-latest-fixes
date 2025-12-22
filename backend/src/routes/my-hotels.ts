import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import BookingModel from "../models/booking";
import UserModel from "../models/user";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increase to 10MB
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
      const roomImageUrls = await Promise.all(
        roomImages.map(async (file) => {
          const roomImage = await uploadImages([file]);
          return {
            category: file.fieldname.split("roomImages")[1],
            images: roomImage,
          };
        })
      );

      // Parse rooms data
      newHotel.rooms = JSON.parse(newHotel.rooms);

      // Process rooms
      const rooms = newHotel.rooms.map((room: any) => {
        // Assign room images
        room.images =
          roomImageUrls.find(
            (roomImage: any) => roomImage.category == room.category
          )?.images || [];

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
      console.log("Starting hotel update process");
      const updatedHotel = req.body;
      console.log("Request body received:", Object.keys(updatedHotel));
      
      try {
        console.log("Parsing rooms JSON");
        updatedHotel.rooms = JSON.parse(updatedHotel.rooms);
        console.log("Rooms parsed successfully");
      } catch (parseError: unknown) {
        console.error("Error parsing rooms JSON:", parseError);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON parsing error';
        return res.status(400).json({ message: "Invalid rooms data format", error: errorMessage });
      }
      
      updatedHotel.lastUpdated = new Date();

      const files = req.files as Express.Multer.File[];
      console.log("Files received:", files.length, "files");
      console.log("File field names:", files.map(f => f.fieldname));
      
      const hotelImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("imageFiles")
      );
      console.log("Hotel images count:", hotelImages.length);
      
      const roomImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("roomImages")
      );
      console.log("Room images count:", roomImages.length);

      try {
        console.log("Uploading hotel images to Cloudinary");
        const updatedImageUrls = await uploadImages(hotelImages);
        console.log("Hotel images uploaded successfully:", updatedImageUrls.length);
        
        updatedHotel.imageUrls = [
          ...updatedImageUrls,
          ...(updatedHotel.imageUrls || []),
        ];
      } catch (uploadError: unknown) {
        console.error("Error uploading hotel images:", uploadError);
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown upload error';
        return res.status(500).json({ message: "Error uploading hotel images", error: errorMessage });
      }

      if (updatedHotel.policies) {
        console.log("Processing policies");
        if (typeof updatedHotel.policies === "string") {
          try {
            const parsed = JSON.parse(updatedHotel.policies);
            updatedHotel.policies = Array.isArray(parsed) ? parsed : [parsed];
          } catch (policyError) {
            console.error("Error parsing policies:", policyError);
            updatedHotel.policies = [updatedHotel.policies];
          }
        } else if (!Array.isArray(updatedHotel.policies)) {
          updatedHotel.policies = [updatedHotel.policies];
        }
      
        // Fetch existing hotel to preserve existing policies
        const existingHotel = await Hotel.findOne({ _id: req.params.hotelId, userId: req.userId });
        if (existingHotel) {
          console.log("Existing hotel found, replacing policies");
          // Don't merge, just replace
          updatedHotel.policies = updatedHotel.policies;
        }
      }
      
      try {
        console.log("Processing room images");
        const roomImageUrls = await Promise.all(
          roomImages.map(async (file) => {
            const roomImage = await uploadImages([file]);
            return {
              category: file.fieldname.split("roomImages")[1],
              images: roomImage,
            };
          })
        );
        console.log("Room images processed successfully");
        
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
      } catch (roomImageError: unknown) {
        console.error("Error processing room images:", roomImageError);
        const errorMessage = roomImageError instanceof Error ? roomImageError.message : 'Unknown room image processing error';
        return res.status(500).json({ 
          message: "Error processing room images", 
          error: errorMessage 
        });
      }

      try {
        console.log("Updating hotel in database");
        const hotel = await Hotel.findOneAndUpdate(
          {
            _id: req.params.hotelId,
            userId: req.userId,
          },
          updatedHotel,
          { new: true }
        );

        if (!hotel) {
          console.log("Hotel not found or user not authorized");
          return res.status(404).json({ message: "Hotel not found or you are not authorized to update it" });
        }

        console.log("Hotel updated successfully");
        return res.status(201).json(hotel);
      } catch (dbError: unknown) {
        console.error("Database error when updating hotel:", dbError);
        const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
        return res.status(500).json({ 
          message: "Database error when updating hotel", 
          error: errorMessage 
        });
      }
    } catch (error: unknown) {
      console.error("Uncaught error in hotel update:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
      return res.status(500).json({ 
        message: "Something went wrong", 
        error: errorMessage,
        stack: errorStack
      });
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
    const hotelData = await Hotel.find({},{_id:1,name:1,rooms:1,imageUrls:1,location:1,type:1,starRating:1,status:1,userId:1});
    if(!hotelData){
      return res.status(404).json({ message: "Hotel not found" });
    }
    const hotelIds = hotelData.map((hotel:any)=>hotel._id.toString());
    // Sort by _id descending to get newest bookings first (ObjectId contains creation timestamp)
    const bookings = await BookingModel.find({hotelId:{$in:hotelIds},deletedAt:null},{__v:0}).sort({_id: -1}).lean();
    const userIds = [...new Set(bookings.map((booking: any) => booking.userId))];
    const userData = await UserModel.find({_id:{$in:userIds}},{mobNo:1,firstName:1,lastName:1});
    
    // Get hotel owner user IDs
    const hotelOwnerIds = [...new Set(hotelData.map((hotel:any) => hotel.userId?.toString()).filter(Boolean))];
    const hotelOwners = await UserModel.find({_id:{$in:hotelOwnerIds}},{firstName:1,lastName:1});
    
    const groupedBookings = bookings.reduce((acc: any, booking: any) => {
    const hotel = hotelData.find((h: any) => h._id.toString() === booking.hotelId);
    if (!hotel) {
      return acc; // Skip if hotel not found
    }
    
    const roomId = booking.roomsId[0];
    const user = userData.find((u: any) => u._id.toString() === booking.userId);
    const hotelOwner = hotelOwners.find((u: any) => u._id.toString() === hotel.userId?.toString());
  
    const hotelName = hotel?.name || '';
    if (!acc[hotelName]) {
      acc[hotelName] = {
        hotelName,
        firstName: hotelOwner?.firstName || '',
        lastName: hotelOwner?.lastName || '',
        email: '', // Owner email not needed for display
        phone: user?.mobNo,
        imageUrl: hotel?.imageUrls?.[0] || '',
        location: hotel?.location || '',
        type: hotel?.type || '',
        starRating: hotel?.starRating || 0,
        status: hotel?.status || 'active',
        bookings: []
      };
    }
    
    // Find the room by matching roomId - handle both string and ObjectId comparisons
    const room = hotel?.rooms.find((r: any) => {
      const roomIdStr = typeof r._id === 'object' ? r._id.toString() : String(r._id);
      const bookingRoomIdStr = String(roomId);
      return roomIdStr === bookingRoomIdStr;
    });
    
    // If room not found by ID, try to get category from first available room as fallback
    // Default to category 1 if no room found (shouldn't happen in normal cases)
    const roomCategory = room?.category ?? hotel?.rooms?.[0]?.category ?? 1;
    
    // Extract creation timestamp from ObjectId for sorting
    // With lean(), _id is a string, so we need to convert it to ObjectId to get timestamp
    let createdAt: Date;
    if (typeof booking._id === 'string') {
      createdAt = new mongoose.Types.ObjectId(booking._id).getTimestamp();
    } else {
      createdAt = booking._id.getTimestamp ? booking._id.getTimestamp() : new Date();
    }
    
    acc[hotelName].bookings.push({
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      category: roomCategory,
      bookingId: booking._id.toString(),
      createdAt: createdAt, // Add creation timestamp for sorting
      roomsCount: booking.roomsId.length.toString(),
      totalCost: booking.totalCost,
      paymentOption: booking.paymentOption || 'full',
      fullAmount: booking.fullAmount || booking.totalCost
    });
  
    return acc;
}, {});

// Sort bookings within each hotel by creation time (when booking was made - latest first)
Object.keys(groupedBookings).forEach((hotelName) => {
  groupedBookings[hotelName].bookings.sort((a: any, b: any) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (newest bookings first)
  });
});

// Transform the groupedBookings object into an array and sort hotels by latest booking creation time
  const bookingsArray = Object.values(groupedBookings);
  
  // Sort hotels by their latest booking's creation time (when booking was made - latest first)
  bookingsArray.sort((a: any, b: any) => {
    const latestBookingA = a.bookings && a.bookings.length > 0 && a.bookings[0].createdAt
      ? new Date(a.bookings[0].createdAt).getTime() 
      : 0;
    const latestBookingB = b.bookings && b.bookings.length > 0 && b.bookings[0].createdAt
      ? new Date(b.bookings[0].createdAt).getTime() 
      : 0;
    return latestBookingB - latestBookingA; // Descending order (newest bookings first)
  });
      return res.status(200).json(bookingsArray);
    }catch(error){
      console.log(error);
      return res.status(500).json({ message: "Unable to fetch hotels" });
    }
  })

async function uploadImages(imageFiles: Express.Multer.File[]) {
  if (!imageFiles || imageFiles.length === 0) {
    console.log("No image files to upload");
    return [];
  }

  console.log(`Preparing to upload ${imageFiles.length} images to Cloudinary`);
  
  const uploadPromises = imageFiles.map(async (image, index) => {
    try {
      console.log(`Processing image ${index + 1}: ${image.originalname}, size: ${image.size}, type: ${image.mimetype}`);
      const b64 = image.buffer.toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      console.log(`Uploading image ${index + 1} to Cloudinary...`);
      const res = await cloudinary.v2.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "hotel-images"
      });
      console.log(`Successfully uploaded image ${index + 1}, URL: ${res.url}`);
      return res.url;
    } catch (error) {
      console.error(`Error uploading image ${index + 1} to Cloudinary:`, error);
      throw error; // Re-throw to be caught by the caller
    }
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    console.log(`Successfully uploaded ${imageUrls.length} images`);
    return imageUrls;
  } catch (error) {
    console.error("Error in Promise.all for image uploads:", error);
    throw error; // Re-throw to be caught by the caller
  }
}

export default router;
