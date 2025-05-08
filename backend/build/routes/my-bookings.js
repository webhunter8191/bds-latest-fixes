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
const auth_1 = __importDefault(require("../middleware/auth"));
const hotel_1 = __importDefault(require("../models/hotel"));
const router = express_1.default.Router();
// /api/my-bookings
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield hotel_1.default.find({
            bookings: { $elemMatch: { userId: req.userId } },
        });
        const results = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter((booking) => booking.userId === req.userId);
            const hotelWithUserBookings = Object.assign(Object.assign({}, hotel.toObject()), { bookings: userBookings });
            return hotelWithUserBookings;
        });
        res.status(200).send(results);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
}));
router.post("/booking", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { firstName, lastName, email, roomCount, checkIn, checkOut, hotelId, totalCost } = req.body;
        // Validate request payload
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({ message: "Invalid check-in or check-out date." });
        }
        const hotel = yield hotel_1.default.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        // Check if a booking already exists for the user with overlapping dates
        const existingBooking = hotel.bookings.find((booking) => booking.userId === userId &&
            ((checkInDate >= new Date(booking.checkIn) && checkInDate <= new Date(booking.checkOut)) ||
                (checkOutDate >= new Date(booking.checkIn) && checkOutDate <= new Date(booking.checkOut))));
        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "A booking already exists for the selected dates.",
            });
        }
        // Add the new booking
        const booking = {
            firstName,
            lastName,
            email,
            roomCount,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            userId,
            totalCost,
        };
        // hotel.bookings.push(booking);
        // const data = await hotel.save();
        const data = yield hotel_1.default.findOneAndUpdate({ _id: hotelId }, {
            $push: { bookings: booking },
        }, { new: true });
        res.status(200).json({ success: true, data: data === null || data === void 0 ? void 0 : data.bookings });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to create booking" });
    }
}));
exports.default = router;
