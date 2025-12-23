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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// iOS/Safari specific middleware
app.use((req, res, next) => {
  // Handle iOS Safari's strict cookie requirements
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  
  if (isIOS || isSafari) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
  }
  
  next();
});
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

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Support comma-separated env list and common local dev ports
    const envOrigins = (process.env.FRONTEND_URL || "")
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    // If no FRONTEND_URL is provided, default to allowing all origins to avoid blocking
    if (!envOrigins.length) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [
      ...envOrigins,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ];

    // Allow Vercel preview/production domains if origin matches *.vercel.app
    let isVercelPreview = false;
    if (origin) {
      try {
        isVercelPreview = /\.vercel\.app$/i.test(new URL(origin).hostname);
      } catch (err) {
        // Malformed origin; reject below
      }
    }

    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  exposedHeaders: ["Set-Cookie"],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Additional headers for Safari/iOS compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin || process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle Safari's strict cookie policies
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Security headers for iOS/Safari
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Only serve static files in development/local environment
// On Vercel, frontend and backend are separate deployments
// Skip static file serving if running on Vercel
if (!process.env.VERCEL) {
  const frontendPath = path.join(__dirname, "../../Frontend/dist");
  const frontendPathAlt = path.join(__dirname, "../../frontend/dist");
  
  // Try both capital and lowercase folder names
  try {
    if (fs.existsSync(frontendPath)) {
      app.use(express.static(frontendPath));
    } else if (fs.existsSync(frontendPathAlt)) {
      app.use(express.static(frontendPathAlt));
    }
  } catch (error) {
    console.log("Frontend dist folder not found, skipping static file serving");
  }
}

// Health check endpoint for iOS/Mac testing
app.get("/api/health", (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    userAgent: userAgent,
    isIOS: isIOS,
    isSafari: isSafari,
    cookies: req.cookies,
    headers: req.headers
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/pdfUpload", pdfUpload);

// Only serve catch-all route in development/local environment
// On Vercel, frontend handles its own routing
// Skip catch-all route if running on Vercel
if (!process.env.VERCEL) {
  app.get("*", (req: Request, res: Response) => {
    const indexPath = path.join(__dirname, "../../Frontend/dist/index.html");
    const indexPathAlt = path.join(__dirname, "../../frontend/dist/index.html");
    
    // Try both capital and lowercase folder names
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else if (fs.existsSync(indexPathAlt)) {
      res.sendFile(indexPathAlt);
    } else {
      res.status(404).json({ message: "Frontend not found" });
    }
  });
}

app.listen(8000, () => {
  console.log("server running on localhost:8000");
});
