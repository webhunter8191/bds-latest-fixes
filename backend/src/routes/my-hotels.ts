import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
import BookingModel from "../models/booking";
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
  // [
  //   body("name").notEmpty().withMessage("Name is required"),
  //   body("type").notEmpty().withMessage("Hotel type is required"),
  //   body("description").notEmpty().withMessage("Description is required"),
  //   body("pricePerNight")
  //     .notEmpty()
  //     .isNumeric()
  //     .withMessage("Price per night is required and must be a number"),
  //   body("facilities")
  //     .notEmpty()
  //     .isArray()
  //     .withMessage("Facilities are required"),
  //   body("nearbyTemple")
  //     .notEmpty()
  //     .isArray()
  //     .withMessage("Nearest temples are required"),
  // ],
  upload,
  async (req: Request, res: Response) => {
    try {
      // Normalize the nearbyTemple entries
      if (req.body.nearbyTemple) {
        req.body.nearbyTemple = req.body.nearbyTemple.map((temple: string) =>
          temple.trim().replace(/\s+/g, " ").toLowerCase()
        );
      }      
      const files = req.files as Express.Multer.File[];
      const hotelImages = files.filter((file: Express.Multer.File) => file.fieldname.startsWith("imageFiles"));
      const roomImages = files.filter((file: Express.Multer.File) => file.fieldname.startsWith("roomImages"));  
      const newHotel = req.body;
      const imageUrls = await uploadImages(hotelImages);
      const roomImageUrls = await Promise.all(roomImages.map(async (file) => {
        const roomImage = await uploadImages([file]);
        return {
          category: file.fieldname.split("roomImages")[1],
          images: roomImage
        }
      }));    
      newHotel.imageUrls = imageUrls;
      newHotel.rooms = JSON.parse(newHotel.rooms);
      const rooms = newHotel.rooms.map((room: any) => {
        room.images = roomImageUrls.find((roomImage: any) =>
          {
            room.availableRooms = room.totalRooms;
            return roomImage.category == room.category}
        )?.images || [];
        return room;
      });
      newHotel.rooms = rooms;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).json({"message":"Hotel created successfully","data":hotel});
    } catch (e) {
      console.log(e);
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
      console.log("updatedHotel is", updatedHotel);
      updatedHotel.lastUpdated = new Date();
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
      const files = req.files as Express.Multer.File[];      
      const updatedImageUrls = await uploadImages(files);
      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];
      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      console.log("error is", error);
      res.status(500).json({ message: "Something went throw" });
    }
  }
);

router.get("/my-bookings/:userId",
  // verifyToken,
   async (req: Request, res: Response) => {
  try{
    const userId = req.params.userId;
    const hotels = (await Hotel.find({userId},{_id:1})).map(hotel=>hotel._id.toString());
    if(!hotels){
      return res.status(404).json({ message: "Hotel not found" });
    }
    const bookings = await BookingModel.find({hotelId:{$in:hotels}},{_id:0, hotelId:0, userId:0, __v:0});
    return res.status(200).json({"message":"bookings fetched successfully", data: bookings });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch bookings" });
  }
})

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
