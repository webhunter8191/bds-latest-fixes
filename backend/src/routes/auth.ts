import express, { Request, Response } from "express";
import User from "../models/user";
import crypto from "crypto";
import bcrypt from "bcrypt";

import nodemailer from "nodemailer";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// 🔹 Get logged-in user info
router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 🔹 User Registration
router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() });

    const { firstName, lastName, email, password, confirmPassword, mobNo, isAdmin } = req.body;
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ firstName, lastName, email, password: hashedPassword, mobNo, isAdmin: isAdmin || false });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    console.log("🔍 Entered Password:", password);
    console.log("🔍 Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1d",
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
      sameSite: "none",
    });

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

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

// 🔹 Request Password Reset
router.post("/request-reset", async (req: Request, res: Response) => {
  const email = req.body.email.toLowerCase(); // ❌ ERROR: `email` is undefined
  try {
    console.log("🔍 Requested Email:", email);

    // Find user by email (ensure lowercase)
    const user = await User.findOne({ email: email.toLowerCase() });

    console.log("🔍 Found User:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await user.save(); // ✅ Ensure saving works

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("🔗 Reset Link:", resetLink); // ✅ Log the link

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465, // or 587 for TLS
      secure: true, // Use true for port 465, false for 587
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      html: `
          Hello ${user.firstName},

          We received a request to reset your password. If you made this request, click the link below:

          ${resetLink}

        If you didn’t request this, ignore this email.

        Thank you,
        Brij Divine Stay
`,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (error) {
    console.error("❌ ERROR:", error); // ✅ Log the error properly
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Something went wrong", error: errorMessage });
  }
});

// 🔹 Reset Password
router.post("/reset-password", async (req: Request, res: Response) => {
  console.log("✅ Reset Password API hit");

  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "Missing token or password" });
  }

  try {
    const user = await User.findOne({ resetToken: token });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("🔍 User Found:", user.email);
    console.log("🔍 Old Hashed Password:", user.password); // Log old password

    // Check if the password is already hashed
    // if (password.startsWith("$2b$")) {
    //   return res.status(400).json({ message: "Password is already hashed" });
    // }

    // Hash new password
    const newHashedPassword = await bcrypt.hash(password, 10);
    console.log("🔍 New Hashed Password:", newHashedPassword); // Log new hash

    // user.password = newHashedPassword;
    // user.resetToken = undefined;
    // user.resetTokenExpiry = undefined;

    await User.updateOne({
      email: user.email,          
    }, {
      password: newHashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
    console.log(user);

    res.json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;

