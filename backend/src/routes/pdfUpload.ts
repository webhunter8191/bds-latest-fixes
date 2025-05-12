import express from "express";
const router = express.Router();
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse, UploadStream } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Increase limit to 20MB
});

// Update multer to handle single file upload and allow additional fields
router.post(
  "/upload",
  upload.single("file"), // Only handle the merged PDF file
  async (req: express.Request & { file?: { buffer: Buffer } }, res: express.Response) => {
    try {
      if (!req.file) {
        console.error("No PDF file uploaded. Request body:", req.body);
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      const propertyName = req.body.propertyName || "default_property_name";

      console.log("Starting Cloudinary upload...");
      const pdfResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: `property_agreements/${propertyName}`, // Explicitly set the folder
            public_id: "agreement", // File name within the folder
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else if (result) {
              console.log("Cloudinary Upload Success:", result);
              resolve(result);
            } else {
              reject(new Error("Upload result is undefined"));
            }
          }
        );
        if (req.file?.buffer) {
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
          throw new Error("File buffer is undefined");
        }
      });
      console.log("Cloudinary upload completed.");

      res.status(200).json({ secure_url: pdfResult.secure_url });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
      res.status(500).json({ error: errorMessage });
    }
  }
);

export default router;