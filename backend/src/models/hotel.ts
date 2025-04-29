import mongoose from "mongoose";
import { HotelType } from "../shared/types";

const roomSchema = new mongoose.Schema({
  category: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
  availableRooms: { type: Number, required: true },
  features: [{ type: String }],
  images: [{ type: String }],
  adultCount: { type: Number, required: true, default: 0 },
  childCount: { type: Number, required: true, default: 0 },
  defaultPrice: { type: Number, required: true }, // Default price for unspecified dates
  priceCalendar: [
    {
      date: { type: Date, required: true }, // Specific date
      price: { type: Number, required: true }, // Price for that date
    },
  ],
});

const hotelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, default: "Mathura" },
    country: { type: String, default: "India" },
    type: { type: String, required: true },
    facilities: [{ type: String, required: true }],
    nearbyTemple: [{ type: String, required: true }],
    imageUrls: [{ type: String, required: true }],
    rooms: [roomSchema],
    status: { type: String, enum: ["active", "archive"], default: "active" },
    policies: { type: [String], required: true },
    temples: [
      {
        name: { type: String, required: true },
        distance: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;