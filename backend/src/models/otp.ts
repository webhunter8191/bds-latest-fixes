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
    createdAt: {
        type: Date,
        required: true,
        index: { expires: "1m" },
    },
});

// Ensure either email or phoneNumber is provided
otpSchema.pre('save', function(next) {
    if (!this.email && !this.phoneNumber) {
        return next(new Error('Either email or phoneNumber is required'));
    }
    next();
});

const OTPModel = mongoose.model("otp-verify", otpSchema);

export default OTPModel;