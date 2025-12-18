import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import paymentRoutes from "./routes/payment";
import otpRoutes from "./routes/otp";
import whatsappOtpRoutes from "./routes/whatsapp-otp";
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
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

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
app.use("/api/whatsapp-otp", whatsappOtpRoutes);
app.use("/api/pdfUpload", pdfUpload);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(8000, () => {
  console.log("server running on localhost:8000");
});
