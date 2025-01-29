import mongoose from "mongoose";
import { HotelType } from "../shared/types";




const roomSchema=new mongoose.Schema({
  price:{type:Number,required:true},
  features:[{type:String}],
  images:[{type:String}],
  status:{type:String,enum:["available","booked","archive"],default:"available"},
})

const hotelSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, default: "Mathura" },
  country: { type: String, default: "India" },
  type: { type: String, required: true },
  facilities: [{ type: String, required: true }],
  nearByTemple: [{ type: String, required: true }],
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
  rooms:[roomSchema],
  status:{type:String, enum:["active","archive"], default:"active"},
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;
