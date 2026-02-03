import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookingType: { type: String, enum: ["hotel", "tour"], default: "hotel" },
    // Hotel bookings use hotelId, tour bookings use tourId
    hotelId: {
      type: String,
      required: function (this: any) {
        return this.bookingType !== "tour";
      },
    },
    tourId: { type: String }, // id from frontend tour.json (e.g. braj-3d)
    tourName: { type: String }, // title from tour.json for display
    roomsId: {
      type: [String],
      default: [],
      required: function (this: any) {
        return this.bookingType !== "tour";
      },
    },
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    rooms:{
      type:String,
      default:"0",
      required: function (this: any) {
        return this.bookingType !== "tour";
      },
    },
    roomCategories: { type: String }, // Add roomCategories
    tourDate: { type: String }, // Add tourDate
    guests: { type: Number }, // Add guests
    includeFood: { type: Boolean }, // Add includeFood
    includeStay: { type: Boolean }, // Add includeStay
    paymentIntentId: { type: String }, // Add paymentIntentId
    paymentOption: { type: String, enum: ['full', 'partial'], default: 'full' },
    fullAmount: { type: Number },
    deletedAt: { type: Date , default:null},
  });


const BookingModel = mongoose.model("booking", bookingSchema);
export default BookingModel;