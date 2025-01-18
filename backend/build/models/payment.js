"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    transactionId: { type: String, required: true },
    date: { type: Date, default: Date.now }, // Date of the payment
}, { timestamps: true } // Automatically creates `createdAt` and `updatedAt` fields
);
const Payment = mongoose_1.default.model("Payment", paymentSchema);
exports.default = Payment;
