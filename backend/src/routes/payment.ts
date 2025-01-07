import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import verifyToken from "../middleware/auth";
import Payment from "../models/payment"
import Hotel from "../models/hotel"; // Your Hotel Model

const router = express.Router();

// Environment Variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID as string;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET as string;

// Validate Razorpay Credentials
if (!RAZORPAY_KEY_ID || !RAZORPAY_SECRET) {
    throw new Error("Razorpay credentials are missing!");
}

// Razorpay Instance
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
});

// Route to Create Razorpay Order
router.post('/order', verifyToken, (req, res) => {
    const { amount } = req.body;

    // Validate the `amount` field
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount provided!" });
    }

    try {
        const options = {
            amount: Math.round(amount * 100), // Convert to smallest currency unit
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"), // Unique receipt ID
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error("Error creating order:", error);
                return res.status(500).json({ message: "Something went wrong!" });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

// Route to Verify Razorpay Payment
router.post('/verify', verifyToken, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature ,amount} = req.body;

  

    try {
        // Generate the signature to verify authenticity
        const generatedSign = crypto
            .createHmac("sha256", RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isAuthentic = generatedSign === razorpay_signature;

        if (isAuthentic) {
            // Save payment record into the database (e.g., a Payment model)
            const paymentData = {
                userId: req.userId, // Assuming userId is available in the token
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amount:Number(amount), // Ensure the amount is passed correctly from the frontend
                status: 'success', // You can track the status of the payment
                transactionId: razorpay_payment_id,
                date: new Date(),
            };

            // Create a new Payment record
            const payment = new Payment(paymentData);
            await payment.save();

         
            // Successful Payment
            res.status(200).json({ message: "Payment successfully verified!" });
        } else {
            // Payment Verification Failed
            res.status(400).json({ message: "Payment verification failed!" });
        }
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

export default router;
