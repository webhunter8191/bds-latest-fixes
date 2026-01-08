import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import paymentRoutes from "./routes/payment";
import otpRoutes from "./routes/otp";
import pdfUpload from "./routes/pdfUpload";
import adminHotelRoutes from "./routes/admin-hotels";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connection = mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
connection.then(() => {
  console.log("Database connectrd succesfully");
})
  .catch((err) => {
  console.error("Database connection Failed ",err)
})

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.options(
//   "*",
//   cors({
//     // origin: ["http://localhost:5173", "http://localhost:5174"],
//     origin: process.env.FRONTEND_URL,
//     methods: ["POST", "GET", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//     preflightContinue: true,
//   })
// );

const corsOptions =Object.freeze({
  origin: process.env.FRONTEND_URL,
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
})
app.use(
  cors(corsOptions)
);




// Serve static files from Frontend dist directory
// Try different possible paths for different deployment environments
const possiblePaths = [
  path.join(__dirname, "../../Frontend/dist"), // Local development (capital F)
  path.join(__dirname, "../../frontend/dist"), // Deployment (lowercase)
  path.join(process.cwd(), "Frontend/dist"),    // Alternative path
  path.join(process.cwd(), "frontend/dist"),    // Alternative path (lowercase)
];

let frontendDistPath: string | null = null;
for (const possiblePath of possiblePaths) {
  try {
    if (fs.existsSync(possiblePath) && fs.existsSync(path.join(possiblePath, "index.html"))) {
      frontendDistPath = possiblePath;
      console.log(`Frontend dist found at: ${frontendDistPath}`);
      break;
    }
  } catch (err) {
    // Continue to next path
  }
}

if (!frontendDistPath) {
  console.warn("Frontend dist directory not found. Static file serving disabled.");
  console.warn("Checked paths:", possiblePaths);
}

if (frontendDistPath) {
  app.use(express.static(frontendDistPath));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/pdfUpload", pdfUpload);
app.use("/api/admin/hotels", adminHotelRoutes);

// Serve index.html for all non-API routes (SPA fallback)
app.get("*", (req: Request, res: Response) => {
  // Skip API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  
  // If frontend dist path was found, serve index.html
  if (frontendDistPath) {
    const indexPath = path.join(frontendDistPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(404).json({ 
          message: "Frontend not found",
          path: indexPath 
        });
      }
    });
  } else {
    // Frontend not found - return error
    res.status(404).json({ 
      message: "Frontend build not found. Please ensure Frontend/dist exists.",
      checkedPaths: possiblePaths
    });
  }
});

app.listen(7000, () => {
  console.log("server running on localhost:7000");
});
