"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_1 = __importDefault(require("../models/hotel"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Search route to find hotels
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = constructSearchQuery(req.query);
        console.log("query", query);
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
        console.log("final Query is", query);
        const hotels = yield hotel_1.default.find(query).sort(sortOptions).skip(skip).limit(pageSize);
        const total = yield hotel_1.default.countDocuments(query);
        const response = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.json(response);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}));
// Fetch all hotels
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotel_1.default.find().sort("-lastUpdated");
        res.json(hotels);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Error fetching hotels" });
    }
}));
// Fetch specific hotel details by ID
router.get("/:id", [(0, express_validator_1.param)("id").notEmpty().withMessage("Hotel ID is required")], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id.toString();
    try {
        const hotel = yield hotel_1.default.findById(id);
        res.json(hotel);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching hotel" });
    }
}));
// Handle booking creation without Stripe
router.post("/:hotelId/bookings", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
        console.log(newBooking);
        // Find the hotel by ID and add the booking to its booking list
        const hotel = yield hotel_1.default.findOneAndUpdate({ _id: req.params.hotelId }, {
            $push: { bookings: newBooking },
        });
        if (!hotel) {
            return res.status(400).json({ message: "hotel not found" });
        }
        // await hotel.save();
        res.status(200).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
}));
// Construct search query for filtering hotels
const constructSearchQuery = (queryParams) => {
    let constructedQuery = {};
    if (queryParams.destination) {
        const templeSearchTerms = Array.isArray(queryParams.destination)
            ? queryParams.destination.map((term) => term.trim().replace(/\s+/g, " ").toLowerCase())
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
            ? queryParams.stars.map((star) => parseInt(star))
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
exports.default = router;
