import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        index: { expires: "1m" },
    },
    });


const OTPModel = mongoose.model("otp-verify", otpSchema);

export default OTPModel;