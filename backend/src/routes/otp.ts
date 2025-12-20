import express, { Request, Response } from "express";
import nodemailer from "nodemailer"; 
import crypto from "crypto"; 
import OTPModel from "../models/otp";
import User from "../models/user"; // Adjust path if needed


const { EMAIL_USER, EMAIL_PASS } = process.env;

const router = express.Router();

// Generate and send OTP
// router.post("/send", async (req: Request, res: Response) => {
//   const { email } = req.body;
//   let otp;

//   // Generate a random OTP
//   const storedOtp = await OTPModel.findOne({ email });
//   if(!storedOtp){
//     otp = crypto.randomInt(100000, 999999).toString();
//     await OTPModel.create({ email, otp, createdAt: new Date() });
//   }
//   else{
//   otp = storedOtp?.otp;
//   }
//   const transporter = nodemailer.createTransport({
//     host: "smtp.hostinger.com", // Hostinger's SMTP server
//     port: 465, // Port for secure connection
//     secure: true, // Use SSL
//     auth: {
//       user: EMAIL_USER, // Replace with your Hostinger email address
//       pass: EMAIL_PASS, // Replace with your Hostinger email password
//     },
//   });

//   // Send OTP email
//   const mailOptions = {
//     from: `"Brij Divine Stay" <${EMAIL_USER}>`,
//     to: email,
//     subject: "Your OTP Code",
//     html: `<h1>Your OTP code is ${otp}</h1>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error sending OTP", error });
//   }
// });

router.post("/send", async (req: Request, res: Response) => {
  const { email } = req.body;

  // ✅ Step 1: Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  let otp;

  // ✅ Step 2: Check if OTP already exists or generate new one
  const storedOtp = await OTPModel.findOne({ email, type: "email" });

  if (!storedOtp) {
    otp = crypto.randomInt(100000, 999999).toString();
    await OTPModel.create({ email, otp, type: "email", createdAt: new Date() });
  } else {
    otp = storedOtp.otp;
  }

  // ✅ Step 3: Send email
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Brij Divine Stay" <${EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<div style="font-family: Arial, sans-serif; color: #333;">
      <p>Your One-Time Password (OTP) is:</p>
      <div style="font-size: 2em; font-weight: bold; margin: 10px 0; color: #7B3F00;">${otp}</div>
      <p>Please use this code to complete your action. For your security, do not share this code with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <div style="text-align: center; margin-top: 20px;">
        <img src="https://res.cloudinary.com/dhsycku8t/image/upload/v1753526435/logo_bds_round_uwoqmw.png" alt="Brij Divine Stay Logo" style="height: 60px; border-radius: 50%;">
        <h3 style="color: #7B3F00; margin: 10px 0;">Brij Divine Stay</h3>
        <p style="font-style: italic; color: #7B3F00; margin: 0;">Live The Divine, Love the Stay</p>
      </div>
    </div>`,
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
    const storedOtp = await OTPModel.findOne({ email, type: "email" }).sort({ createdAt: -1 });

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