import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import whatsappService from "../utils/whatsapp";

const router = express.Router();
// test cookie
router.get("/test-cookie", (req: Request, res: Response) => {
  res.cookie("test_cookie", "test_value", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60000,
  });
  res.send("Test cookie has been set.");
});

router.get("/check-cookie", (req: Request, res: Response) => {
  const value = req.cookies["test_cookie"];
  res.send({ cookieValue: value || "No cookie received" });
});



router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { userId: user.id ,isAdmin:user.isAdmin},
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        maxAge: 86400000,
        sameSite: 'none'
      });
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId ,isAdmin:req.isAdmin});
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000,
    sameSite: 'none',
    expires: new Date(0),
  });
  res.send();
});

// Register with phone number
router.post(
  "/register-phone",
  [
    check("phoneNumber", "Phone number is required").notEmpty(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
    check("firstName", "First name is required").notEmpty(),
    check("lastName", "Last name is required").notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { phoneNumber, password, firstName, lastName, email } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { phoneNumber },
          { email: email || null }
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create new user
      const user = new User({
        phoneNumber,
        email,
        password,
        firstName,
        lastName,
      });

      await user.save();

      // Send welcome message via WhatsApp
      try {
        await whatsappService.sendWelcomeMessage(phoneNumber, firstName);
      } catch (whatsappError) {
        console.error('Failed to send welcome WhatsApp message:', whatsappError);
        // Don't fail registration if WhatsApp message fails
      }

      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
        sameSite: 'none'
      });

      res.status(201).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// Login with phone number
router.post(
  "/login-phone",
  [
    check("phoneNumber", "Phone number is required").notEmpty(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { phoneNumber, password } = req.body;

    try {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
        sameSite: 'none'
      });

      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;
