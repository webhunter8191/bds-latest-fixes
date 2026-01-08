import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).any();

// Middleware to check if user is admin
const verifyAdmin = (req: Request, res: Response, next: any) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Get all hotels (admin only)
router.get("/", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json(hotels);
  } catch (error) {
    console.error("Error fetching all hotels:", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// Get specific hotel by ID (admin only)
router.get("/:hotelId", verifyToken, verifyAdmin, async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId).lean();

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Ensure all room features are properly formatted arrays
    if (hotel.rooms && hotel.rooms.length) {
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
          room.features = Object.values(room.features);
        }
        
        if (Array.isArray(room.features)) {
          room.features = [...new Set(room.features)];
        }
        
        return room;
      });
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

// Update any hotel (admin only)
router.put(
  "/:hotelId",
  verifyToken,
  verifyAdmin,
  upload,
  async (req: Request, res: Response) => {
    try {
      console.log("Admin updating hotel:", req.params.hotelId);
      const updatedHotel = req.body;

      try {
        updatedHotel.rooms = JSON.parse(updatedHotel.rooms);
      } catch (parseError: unknown) {
        console.error("Error parsing rooms JSON:", parseError);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown JSON parsing error';
        return res.status(400).json({ message: "Invalid rooms data format", error: errorMessage });
      }

      updatedHotel.lastUpdated = new Date();

      // Normalize nearbyTemple entries
      if (updatedHotel.nearbyTemple) {
        if (Array.isArray(updatedHotel.nearbyTemple)) {
          updatedHotel.nearbyTemple = updatedHotel.nearbyTemple.map((temple: string) =>
            temple.trim().replace(/\s+/g, " ").toLowerCase()
          );
        } else if (typeof updatedHotel.nearbyTemple === "string") {
          try {
            const parsed = JSON.parse(updatedHotel.nearbyTemple);
            updatedHotel.nearbyTemple = Array.isArray(parsed)
              ? parsed.map((temple: string) => temple.trim().replace(/\s+/g, " ").toLowerCase())
              : [parsed.trim().replace(/\s+/g, " ").toLowerCase()];
          } catch {
            updatedHotel.nearbyTemple = [updatedHotel.nearbyTemple.trim().replace(/\s+/g, " ").toLowerCase()];
          }
        }
      }

      const files = req.files as Express.Multer.File[];
      const hotelImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("imageFiles")
      );
      const roomImages = files.filter((file: Express.Multer.File) =>
        file.fieldname.startsWith("roomImages")
      );

      // Upload hotel images
      if (hotelImages.length > 0) {
        const updatedImageUrls = await uploadImages(hotelImages);
        updatedHotel.imageUrls = [
          ...updatedImageUrls,
          ...(updatedHotel.imageUrls || []),
        ];
      }

      // Handle policies
      if (updatedHotel.policies) {
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
      }

      // Handle temples
      if (updatedHotel.temples) {
        if (typeof updatedHotel.temples === "string") {
          try {
            const parsed = JSON.parse(updatedHotel.temples);
            updatedHotel.temples = Array.isArray(parsed) ? parsed : [parsed];
          } catch (templeError) {
            console.error("Error parsing temples:", templeError);
            return res.status(400).json({ message: "Invalid temples format" });
          }
        }
        if (Array.isArray(updatedHotel.temples)) {
          updatedHotel.temples = updatedHotel.temples.map((temple: any) => ({
            name: temple.name || "",
            distance: Number(temple.distance) || 0,
          }));
        }
      }

      // Process room images
      if (roomImages.length > 0) {
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
          const newRoomImages = roomImageUrls.find(
            (roomImage: any) => roomImage.category == room.category
          )?.images;

          if (newRoomImages && newRoomImages.length > 0) {
            room.images = newRoomImages;
          } else {
            // Keep existing images if no new ones uploaded
            const existingRoom = updatedHotel.rooms.find(
              (existingRoom: any) => existingRoom.category == room.category
            );
            if (existingRoom && existingRoom.images) {
              room.images = existingRoom.images;
            }
          }

          room.adultCount = Number(room.adultCount) || 0;
          room.childCount = Number(room.childCount) || 0;

          return room;
        });
      }

      // Update hotel (admin can update any hotel, no userId check)
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.hotelId,
        updatedHotel,
        { new: true }
      );

      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      console.log("Hotel updated successfully by admin");
      return res.status(200).json(hotel);
    } catch (error: unknown) {
      console.error("Error updating hotel:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({
        message: "Error updating hotel",
        error: errorMessage,
      });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  const uploadPromises = imageFiles.map(async (image) => {
    try {
      const b64 = image.buffer.toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.v2.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "hotel-images"
      });
      return res.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Error in Promise.all for image uploads:", error);
    throw error;
  }
}

export default router;
