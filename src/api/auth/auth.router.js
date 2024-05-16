const express = require("express");
const authController = require("../auth/auth.controller");
const Authenticate = require("../../middleware/authCheck");
const multer = require("multer");
const AWS = require("aws-sdk");

const router = express.Router();

// API endpoints
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.login);
router.post("/sign-out", Authenticate, authController.signOut);

router.delete('/delete/image/:key/**', authController.deleteFileFromS3)

router.post('/create-order', Authenticate, authController.createOrder)

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Change to your desired region
});

const s3 = new AWS.S3();

// Multer middleware configuration for handling file uploads
const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 2 MB in bytes
  // },
}).array("images", 1);

// API endpoint for uploading multiple image files to S3
router.post("/upload-images", upload, async (req, res) => {
  try {
    const { files } = req;

    // Check if files were provided in the request
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedImages = [];

    // Iterate through the uploaded files and upload them to S3
    for (const file of files) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `images/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype,
      };

      const result = await s3.upload(params).promise();
      console.log(result);

      if (!result.Location) {
        return res
          .status(500)
          .json({ error: "Failed to upload one or more images" });
      }

      uploadedImages.push({
        location: result.Location,
        key: result.key, // Include the Key in the response
      });
    }

    // Respond with the S3 URLs of the uploaded images
    res
      .status(200)
      .json({
        message: "Images uploaded successfully",
        images: uploadedImages,
      });
  } catch (error) {
    console.error("Error uploading images to S3:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
