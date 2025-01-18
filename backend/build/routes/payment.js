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
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = __importDefault(require("../middleware/auth"));
const payment_1 = __importDefault(require("../models/payment"));
const router = express_1.default.Router();
// Environment Variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;
// Validate Razorpay Credentials
if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
    throw new Error("Razorpay credentials are missing!");
}
// Razorpay Instance
const razorpayInstance = new razorpay_1.default({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
});
// Route to Create Razorpay Order
router.post('/order', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    // Validate the `amount` field
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount provided!" });
    }
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: crypto_1.default.randomBytes(10).toString("hex"), // Unique receipt ID
        };
        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error("Error creating order:", error);
                return res.status(500).json({ message: "Something went wrong!" });
            }
            res.status(200).json({ data: order });
        });
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}));
// Route to Verify Razorpay Payment
router.post('/verify', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    try {
        // Generate the signature to verify authenticity
        const generatedSign = crypto_1.default
            .createHmac("sha256", RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");
        const isAuthentic = generatedSign === razorpay_signature;
        if (isAuthentic) {
            // Save payment record into the database (e.g., a Payment model)
            const paymentData = {
                userId: req.userId,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amount: Number(amount),
                status: 'success',
                transactionId: razorpay_payment_id,
                date: new Date(),
            };
            // Create a new Payment record
            const payment = new payment_1.default(paymentData);
            yield payment.save();
            // Successful Payment
            res.status(200).json({ message: "Payment successfully verified!" });
        }
        else {
            // Payment Verification Failed
            res.status(400).json({ message: "Payment verification failed!" });
        }
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}));
exports.default = router;
