import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import { getAuthCookieOptions } from "../utils/cookies";

const router = express.Router();
// test cookie
router.get("/test-cookie", (req: Request, res: Response) => {
  const cookieOptions = getAuthCookieOptions(60000);
  res.cookie("test_cookie", "test_value", cookieOptions);
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
      res.cookie("auth_token", token, getAuthCookieOptions());
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
  const cookieOptions = getAuthCookieOptions(0);
  cookieOptions.expires = new Date(0);
  res.cookie("auth_token", "", cookieOptions);
  res.send();
});

export default router;
