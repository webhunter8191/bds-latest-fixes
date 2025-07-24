import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    phoneNumber: {
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
        index: { expires: "5m" },
    },
    });


const OTPModel = mongoose.model("otp-verify", otpSchema);

export default OTPModel;