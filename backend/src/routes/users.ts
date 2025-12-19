import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import { getAuthCookieOptions } from "../utils/cookies";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required")
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { firstName, lastName, email, password, confirmPassword, mobNo, isAdmin } =
      req.body;
    
       if (password !== confirmPassword) {
         return res.status(400).json({ message: "Passwords do not match" });
       }
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      
      user = new User({
        firstName,
        lastName,
        email,
        password,
        mobNo,
        isAdmin: isAdmin !== undefined ? isAdmin : false, 
      });
      await user.save();

      const token = jwt.sign(
        { userId: user.id ,isAdmin:user.isAdmin},
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      // Return token in response body for Bearer token authentication
      // Also set cookie for backward compatibility (optional)
      res.cookie("auth_token", token, getAuthCookieOptions());
      return res.status(200).send({ 
        message: "User registered OK",
        token: token,
        userId: user._id,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

export default router;
