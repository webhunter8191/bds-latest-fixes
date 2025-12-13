import express, { Request, Response } from "express";
import nodemailer from "nodemailer"; 
import crypto from "crypto"; 
import OTPModel from "../models/otp";
import User from "../models/user";
import whatsappService from "../utils/whatsapp";

const { EMAIL_USER, EMAIL_PASS } = process.env;

const router = express.Router();

// Send OTP via WhatsApp
router.post("/send-whatsapp", async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  // Validate phone number format
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ 
      message: "Please enter a valid phone number with country code (e.g., +1234567890)" 
    });
  }

  let otp;

  // ✅ Step 1: Check if OTP already exists or generate new one
  const storedOtp = await OTPModel.findOne({ phoneNumber });

  if (!storedOtp) {
    otp = crypto.randomInt(100000, 999999).toString();
    await OTPModel.create({ phoneNumber, otp, createdAt: new Date() });
  } else {
    otp = storedOtp.otp;
  }

  try {
    // ✅ Step 2: Send WhatsApp message
    await whatsappService.sendOTP(phoneNumber, otp);
    res.status(200).json({ message: "OTP sent successfully via WhatsApp" });
  } catch (error: any) {
    console.error('WhatsApp OTP Error:', error);
    res.status(500).json({ message: "Error sending OTP via WhatsApp", error: error.message });
  }
});

// Send OTP via Email (keeping for backward compatibility)
router.post("/send-email", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: "Please enter a valid email address" 
    });
  }

  let otp;

  // ✅ Step 1: Check if OTP already exists or generate new one
  const storedOtp = await OTPModel.findOne({ email });

  if (!storedOtp) {
    otp = crypto.randomInt(100000, 999999).toString();
    await OTPModel.create({ email, otp, createdAt: new Date() });
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
    res.status(200).json({ message: "OTP sent successfully via email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP via email", error });
  }
});

// Legacy route for backward compatibility (defaults to email)
router.post("/send", async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  // If phone number is provided, use WhatsApp
  if (phoneNumber) {
    // Call the WhatsApp OTP function directly
    const { phoneNumber: phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        message: "Please enter a valid phone number with country code (e.g., +1234567890)" 
      });
    }

    let otp;
    const storedOtp = await OTPModel.findOne({ phoneNumber: phone });
    if (!storedOtp) {
      otp = crypto.randomInt(100000, 999999).toString();
      await OTPModel.create({ phoneNumber: phone, otp, createdAt: new Date() });
    } else {
      otp = storedOtp.otp;
    }

    try {
      await whatsappService.sendOTP(phone, otp);
      res.status(200).json({ message: "OTP sent successfully via WhatsApp" });
    } catch (error: any) {
      console.error('WhatsApp OTP Error:', error);
      res.status(500).json({ message: "Error sending OTP via WhatsApp", error: error.message });
    }
    return;
  }

  // Otherwise, use email
  if (email) {
    // Call the email OTP function directly
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please enter a valid email address" 
      });
    }

    let otp;
    const storedOtp = await OTPModel.findOne({ email });
    if (!storedOtp) {
      otp = crypto.randomInt(100000, 999999).toString();
      await OTPModel.create({ email, otp, createdAt: new Date() });
    } else {
      otp = storedOtp.otp;
    }

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
      res.status(200).json({ message: "OTP sent successfully via email" });
    } catch (error: any) {
      res.status(500).json({ message: "Error sending OTP via email", error: error.message });
    }
    return;
  }

  return res.status(400).json({ message: "Either email or phone number is required" });
});

// Verify OTP (supports both email and phone number)
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    let storedOtp;

    if (phoneNumber) {
      // Verify by phone number
      storedOtp = await OTPModel.findOne({ phoneNumber }).sort({ createdAt: -1 });
    } else if (email) {
      // Verify by email
      storedOtp = await OTPModel.findOne({ email }).sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: "Either email or phone number is required" });
    }

    if (storedOtp && storedOtp.otp === otp) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
});

export default router;