import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    hotelId: { type: String, required: true },
    roomsId: [{ type: String, required: true }],
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    deletedAt: { type: Date , default:null},
  });


const BookingModel = mongoose.model("booking", bookingSchema);
export default BookingModel;