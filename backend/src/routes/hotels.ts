import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import BookingModel from "../models/booking";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import mongoose from "mongoose";

const router = express.Router();

// Search route to find hotels
// router.get("/search", async (req: Request, res: Response) => {
//   try {
//     const query = constructSearchQuery(req.query);

//     const sortOption = req.query.sortOption;
//     let sortOptions: { [key: string]: 1 | -1 } = { pricePerNight: 1 };
//     if (sortOption === "starRating") sortOptions = { starRating: -1 };
//     if (sortOption === "pricePerNightAsc") sortOptions = { pricePerNight: 1 };
//     if (sortOption === "pricePerNightDesc") sortOptions = { pricePerNight: -1 };

//     const pageSize = Math.min(20, parseInt(req.query.pageSize?.toString() || "10")); // Limit to 20 items per page
//     const pageNumber = Math.max(1, parseInt(req.query.page?.toString() || "1")); // Ensure page number is at least 1
//     const skip = (pageNumber - 1) * pageSize;

//     const targetDate = req.query.date ? new Date(req.query.date.toString()) : new Date();
//     const targetDateStr = targetDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
//     const roomCount = parseInt(req.query.roomCount as string) || 1;

//     const hotels = await Hotel.aggregate([
//       { $match: query },
//       {
//         $addFields: {
//           pricePerNight: {
//             $min: {
//               $map: {
//                 input: {
//                   $filter: {
//                     input: "$rooms",
//                     as: "room",
//                     cond: { $gte: ["$$room.availableRooms", roomCount] }
//                   }
//                 },
//                 as: "room",
//                 in: {
//                   $let: {
//                     vars: {
//                       matchedCalendar: {
//                         $first: {
//                           $filter: {
//                             input: "$$room.priceCalendar",
//                             as: "cal",
//                             cond: {
//                               $eq: [
//                                 { $dateToString: { format: "%Y-%m-%d", date: "$$cal.date" } },
//                                 targetDateStr
//                               ]
//                             }
//                           }
//                         }
//                       }
//                     },
//                     in: {
//                       $ifNull: ["$$matchedCalendar.price", "$$room.defaultPrice"]
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       },
//       { $sort: sortOptions },
//       { $skip: skip },
//       { $limit: pageSize },
//       {
//         $project: {
//           name: 1,
//           imageUrls: 1,
//           pricePerNight: 1,
//           type: 1,
//           facilities: 1,
//           rooms: 1,
//         }
//       }
//     ]);

//     const total = await Hotel.countDocuments(query);

//     const response: HotelSearchResponse = {
//       data: hotels,
//       pagination: {
//         total,
//         page: pageNumber,
//         pages: Math.ceil(total / pageSize)
//       }
//     };

//     res.json(response);
//   } catch (error) {
//     console.error("Error in /search route:", error);
//     res.status(500).json({ message: "Error fetching hotels" });
//   }
// });
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    // Determine the sort option
    const sortOption = req.query.sortOption;
    let sortOptions: { [key: string]: 1 | -1 } = { pricePerNight: 1 };
    if (sortOption === "starRating") sortOptions = { starRating: -1 };
    if (sortOption === "pricePerNightAsc") sortOptions = { pricePerNight: 1 };
    if (sortOption === "pricePerNightDesc") sortOptions = { pricePerNight: -1 };

    // Pagination setup
    const pageSize = Math.min(20, parseInt(req.query.pageSize?.toString() || "10")); // Limit to 20 items per page
    const pageNumber = Math.max(1, parseInt(req.query.page?.toString() || "1")); // Ensure page number is at least 1
    const skip = (pageNumber - 1) * pageSize;

    // Process the check-in date (defaults to today if not provided)
    const targetDate = req.query.date ? new Date(req.query.date.toString()) : new Date();
    const targetDateStr = targetDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const roomCount = parseInt(req.query.roomCount as string) || 1;

    // Query hotels
    const hotels = await Hotel.aggregate([
      { $match: query },
      {
        $addFields: {
          pricePerNight: {
            $min: {
              $map: {
                input: {
                  $filter: {
                    input: "$rooms",
                    as: "room",
                    cond: { $gte: ["$$room.availableRooms", roomCount] }
                  }
                },
                as: "room",
                in: {
                  $let: {
                    vars: {
                      matchedCalendar: {
                        $first: {
                          $filter: {
                            input: "$$room.priceCalendar",
                            as: "cal",
                            cond: {
                              $eq: [
                                { $dateToString: { format: "%Y-%m-%d", date: "$$cal.date" } },
                                targetDateStr
                              ]
                            }
                          }
                        }
                      }
                    },
                    in: {
                      $ifNull: ["$$matchedCalendar.price", "$$room.defaultPrice"]
                    }
                  }
                }
              }
            }
          }
        }
      },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          name: 1,
          imageUrls: 1,
          pricePerNight: 1,
          type: 1,
          facilities: 1,
          rooms: {
            _id: 1,
            category: 1,
            type: 1,
            images: 1,
            availableRooms: 1,
            adultCount: 1,
            childCount: 1,
            defaultPrice: 1,
            features: 1,
            priceCalendar: 1
          }
        }
      }
    ]);

    // Calculate total and pagination
    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize)
      }
    };

    res.json(response);
  } catch (error) {
    console.error("Error in /search route:", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});



// Fetch all hotels
// router.get("/", async (req: Request, res: Response) => {
//   try {
//     const aggregation = [
//       { $match: { status: "active" } },
//       {
//         $addFields: {
//           status: {
//             $cond: {
//               if: {
//                 $gt: [
//                   {
//                     $size: {
//                       $filter: {
//                         input: "$rooms",
//                         as: "room",
//                         cond: {
//                           $and: [
//                             { $lte: ["$$room.availableRooms", "$$room.totalRooms"] },
//                             { $ne: ["$$room.availableRooms", 0] },
//                           ]
//                         }
//                       }
//                     }
//                   },
//                   0
//                 ]
//               },
//               then: "active",
//               else: "booked"
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           name: 1,
//           status: 1,
//           imageUrls: 1,
//         }
//       }
//     ];
//     const hotels = await Hotel.aggregate(aggregation);
//     return res.status(200).json(hotels);
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json({ message: "Error fetching hotels" });
//   }
// });

router.get("/", async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.aggregate([
      { $match: { status: "active" } },
      { $sort: { createdAt: -1 } }, // Sort by latest created hotels
      { $limit: 50 }, // Increased from 5 to 50 hotels for better price analysis
      {
        $project: {
          name: 1,
          status: 1,
          imageUrls: 1,
          city: 1,
          location: 1,
          facilities: 1,
          rooms: {
            _id: 1,
            defaultPrice: 1, // Include price data for comparison
            availableRooms: 1,
          },
          temples: 1, // Include temple proximity data
          createdAt: 1, 
        },
      },
    ]);

    return res.status(200).json(hotels);
  } catch (error) {
    console.log("Error fetching hotels:", error);
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
    
    // First fetch the hotel to check raw data
    const rawHotel = await Hotel.findById(id);
    console.log("Raw hotel data:", JSON.stringify({
      id: rawHotel?._id,
      name: rawHotel?.name,
      roomCount: rawHotel?.rooms?.length
    }));
    
    if (rawHotel?.rooms?.length) {
      console.log("Raw features data sample:", 
        rawHotel.rooms.map((r: any) => ({ 
          category: r.category, 
          features: r.features,
          featuresType: typeof r.features
        }))
      );
    }
    
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
      },
      {
        $project: {
          name: 1,
          description: 1,
          type: 1,
          city: 1,
          country: 1,
          location: 1,
          facilities: 1,
          imageUrls: 1,
          nearbyTemple: 1,
          temples: 1,
          policies: 1,
          rooms: {
            _id: 1,
            category: 1,
            type: 1,
            images: 1,
            availableRooms: 1,
            adultCount: 1,
            childCount: 1,
            defaultPrice: 1,
            features: 1,
            priceCalendar: 1
          }
        }
      }
    ];
    
    const [hotel] = await Hotel.aggregate(aggregation);
    
    // Log the processed hotel data
    if (hotel?.rooms?.length) {
      console.log("Processed hotel rooms features:", 
        hotel.rooms.map((r: any) => ({ 
          category: r.category, 
          features: r.features
        }))
      );
      
      // Ensure all room features are properly formatted arrays
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
      
      console.log("Normalized room features:", 
        hotel.rooms.map((r: any) => ({ 
          category: r.category, 
          features: r.features
        }))
      );
    }
    
    return res.status(200).json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

// Construct search query for filtering hotels
const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    const searchTerm = queryParams.destination.trim().toLowerCase();
    
    // Create a regex pattern for partial matching
    const regex = new RegExp(searchTerm, 'i');
    
    // Search in multiple fields related to location
    constructedQuery.$or = [
      { 'nearbyTemple': { $regex: regex } },
      { 'location': { $regex: regex } },
      { 'name': { $regex: regex } },
      { 'temples.name': { $regex: regex } }
    ];
  }

  // Add specific temple filters if provided
  if (queryParams.temples) {
    const templeFilters = Array.isArray(queryParams.temples)
      ? queryParams.temples
      : [queryParams.temples];

    // Create case-insensitive regex patterns for each temple
    const templeRegexes = templeFilters.map(
      (temple: string) => new RegExp(temple.trim(), 'i')
    );

    // If we already have destination search, enhance it
    if (constructedQuery.$or) {
      // We need to add an $and condition to the existing query
      constructedQuery = {
        $and: [
          constructedQuery,
          { 'nearbyTemple': { $in: templeRegexes } }
        ]
      };
    } else {
      // If no destination search yet, create a direct nearbyTemple query
      constructedQuery.nearbyTemple = { $in: templeRegexes };
    }
  }

  if (queryParams.roomCount) {
    constructedQuery['rooms'] = {
      $elemMatch: {
        availableRooms: { $gte: parseInt(queryParams.roomCount) }
      }
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
