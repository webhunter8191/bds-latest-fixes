import express, { Request, Response } from "express";
import crypto from "crypto";
import OTPModel from "../models/otp";
import { WhatsAppService } from "../services/whatsappService";

const router = express.Router();

// Send WhatsApp OTP
router.post("/send", async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

   
    const formattedPhone = WhatsAppService.formatPhoneNumber(phoneNumber);

    // Delete any existing OTP for this phone number (security best practice)
    await OTPModel.deleteMany({ 
      phoneNumber: formattedPhone, 
      type: 'whatsapp' 
    });

    // Always generate a fresh 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store the new OTP
    await OTPModel.create({ 
      phoneNumber: formattedPhone, 
      otp, 
      type: 'whatsapp',
      createdAt: new Date() 
    });

    // Send WhatsApp OTP using template (working method)
    const success = await WhatsAppService.sendOTP(formattedPhone, otp);

    if (success) {
      res.status(200).json({ 
        message: "OTP sent successfully to WhatsApp",
        phoneNumber: formattedPhone 
      });
    } else {
      // If sending fails, clean up the OTP from database
      await OTPModel.deleteMany({ 
        phoneNumber: formattedPhone, 
        type: 'whatsapp' 
      });
      res.status(500).json({ message: "Failed to send WhatsApp OTP" });
    }

  } catch (error) {
    console.error("WhatsApp OTP send error:", error);
    res.status(500).json({ message: "Error sending WhatsApp OTP", error });
  }
});

// Verify WhatsApp OTP
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    const formattedPhone = WhatsAppService.formatPhoneNumber(phoneNumber);

    // Fetch the latest OTP for the given phone number
    const storedOtp = await OTPModel.findOne({ 
      phoneNumber: formattedPhone, 
      type: 'whatsapp' 
    }).sort({ createdAt: -1 });

    if (storedOtp && storedOtp.otp === otp) {
      // Delete the OTP after successful verification
      await OTPModel.deleteOne({ _id: storedOtp._id });
      
      res.status(200).json({ 
        message: "WhatsApp OTP verified successfully",
        phoneNumber: formattedPhone 
      });
    } else {
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("WhatsApp OTP verify error:", error);
    res.status(500).json({ message: "Error verifying WhatsApp OTP", error });
  }
});

// Resend WhatsApp OTP
router.post("/resend", async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const formattedPhone = WhatsAppService.formatPhoneNumber(phoneNumber);

    // Delete existing OTP
    await OTPModel.deleteMany({ 
      phoneNumber: formattedPhone, 
      type: 'whatsapp' 
    });

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    await OTPModel.create({ 
      phoneNumber: formattedPhone, 
      otp, 
      type: 'whatsapp',
      createdAt: new Date() 
    });

    // Send WhatsApp OTP using template (working method)
    const success = await WhatsAppService.sendOTP(formattedPhone, otp);

    if (success) {
      res.status(200).json({ 
        message: "OTP resent successfully to WhatsApp",
        phoneNumber: formattedPhone 
      });
    } else {
      res.status(500).json({ message: "Failed to resend WhatsApp OTP" });
    }

  } catch (error) {
    console.error("WhatsApp OTP resend error:", error);
    res.status(500).json({ message: "Error resending WhatsApp OTP", error });
  }
});

export default router;