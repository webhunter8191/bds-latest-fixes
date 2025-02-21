import express, { Request, Response } from "express";
import nodemailer from "nodemailer"; 
import crypto from "crypto"; 
import OTPModel from "../models/otp";

const { GMAIL_USER, GMAIL_PASS } = process.env;

const router = express.Router();

// Generate and send OTP
router.post("/send", async (req: Request, res: Response) => {
  const { email } = req.body;
  let otp;

  // Generate a random OTP
  const storedOtp = await OTPModel.findOne({ email });
  if(!storedOtp){
    otp = crypto.randomInt(100000, 999999).toString();
    await OTPModel.create({ email, otp, createdAt: new Date() });
  }
  else{
  otp = storedOtp?.otp;
  }
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: GMAIL_USER, 
      pass: GMAIL_PASS, 
    },
  });

  // Send OTP email
  const mailOptions = {
    from: GMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `<h1>Your OTP code is ${otp}</h1>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Verify OTP
router.post("/verify", async (req: Request, res: Response) => {
  try{
  const { email, otp } = req.body;
  const storedOtp = await OTPModel.findOne({ email }).sort({ createdAt: -1 }).limit(1);
  if (storedOtp && storedOtp.otp === otp) {
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
}
catch(error){
  res.status(500).json({ message: "Error verifying OTP", error });
}
});

export default router; 