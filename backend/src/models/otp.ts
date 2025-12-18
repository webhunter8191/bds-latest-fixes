import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    otp: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['email', 'whatsapp'],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        index: { expires: "5m" }
    },
});


const OTPModel = mongoose.model("otp-verify", otpSchema);

export default OTPModel;