import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import BookingModel from "../models/booking";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import mongoose from "mongoose";

const router = express.Router();

// Search route to find hotels
router.get("/search", async (req: Request, res: Response) => {
  try {    
    const query = constructSearchQuery(req.query);
    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize);
    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Fetch all hotels
router.get("/", async (req: Request, res: Response) => {
  try {
    const aggregation = [
      { $match: { status: "active" } },
      {
        $addFields: {
          status: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$rooms",
                        as: "room",
                        cond: {
                          $and: [
                            { $lte: ["$$room.availableRooms", "$$room.totalRooms"] },
                            { $ne: ["$$room.availableRooms", 0] },
                          ]
                        }
                      }
                    }
                  },
                  0
                ]
              },
              then: "active",
              else: "booked"
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          status: 1,
          imageUrls: 1,
        }
      }
    ];
    const hotels = await Hotel.aggregate(aggregation);
    return res.status(200).json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

// Fetch specific hotel details by ID
router.get("/:id", [param("id").notEmpty().withMessage("Hotel ID is required")], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString(); 
    const aggregation = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          rooms: {
            $filter: {
              input: "$rooms",
              as: "room",
              cond: { $gt: ["$$room.availableRooms", 0] }
            }
          }
        }
      }
    ];
    const [hotel] = await Hotel.aggregate(aggregation);
    return res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

// Handle booking creation without Stripe
// router.post("/:hotelId/bookings", verifyToken, async (req: Request, res: Response) => {
//   try {
//     const bookingDetails = req.body;
//     const hotelId = req.params.hotelId;
//     const hotel = await Hotel.findById(hotelId);
//     if(!hotel){
//       return res.status(400).json({message:"Hotel not found"});
//     }
//     await BookingModel.create(bookingDetails);
//     return res.status(200).json({"message":"Hotel Booked Successfully"});
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "something went wrong" });
//   }
// });

// Construct search query for filtering hotels
const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    const templeSearchTerms = Array.isArray(queryParams.destination)
      ? queryParams.destination.map((term: string) =>
          term.trim().replace(/\s+/g, " ").toLowerCase()
        )
      : [queryParams.destination.trim().replace(/\s+/g, " ").toLowerCase()];

    constructedQuery.nearbyTemple = {
      $in: templeSearchTerms,
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);
    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  if (queryParams.roomCount) {
    constructedQuery.roomCount = {
      $gte: parseInt(queryParams.roomCount), // Ensures the hotel has enough rooms available
    };
  }

  return constructedQuery;
};

router.patch("/:id",verifyToken, async (req: Request, res: Response) => {
  try{
    const {id}=req.params;
    const {status='archive'}=req.query;
    const response = await Hotel.findByIdAndUpdate({
      _id:id
    },{
      $set:{status}
    });
    if(!response){
      return res.status(400).json({message:"Hotel not found"});
    }
    return res.status(200).json({message:"Hotel status updated successfully"});    
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:"Something went wrong"});
  }
});

export default router;
