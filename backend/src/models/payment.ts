import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // ID of the user who made the payment
    razorpayOrderId: { type: String, required: true }, // Razorpay order ID
    razorpayPaymentId: { type: String, required: true }, // Razorpay payment ID
    amount: { type: Number, required: true }, // Amount paid by the user
    status: { type: String, enum: ['success', 'failed'], required: true }, // Payment status
    transactionId: { type: String, required: true }, // Transaction ID for the payment
    date: { type: Date, default: Date.now }, // Date of the payment
  
  },
  { timestamps: true } // Automatically creates `createdAt` and `updatedAt` fields
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
