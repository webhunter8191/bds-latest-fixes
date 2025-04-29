import express, { Request, Response } from "express";
import nodemailer from "nodemailer"; 
import crypto from "crypto"; 
import OTPModel from "../models/otp";

const { EMAIL_USER, EMAIL_PASS } = process.env;

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
    host: "smtp.hostinger.com", // Hostinger's SMTP server
    port: 465, // Port for secure connection
    secure: true, // Use SSL
    auth: {
      user: EMAIL_USER, // Replace with your Hostinger email address
      pass: EMAIL_PASS, // Replace with your Hostinger email password
    },
  });

  // Send OTP email
  const mailOptions = {
    from: `"Brij Divine Stay" <${EMAIL_USER}>`,
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
  try {
    const { email, otp } = req.body;

    // Fetch the latest OTP for the given email
    const storedOtp = await OTPModel.findOne({ email }).sort({ createdAt: -1 });

    if (storedOtp && storedOtp.otp === otp) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
});

export default router;