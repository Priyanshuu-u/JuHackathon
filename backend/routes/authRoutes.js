import express from "express";
import multer from "multer";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
router.post("/signup", upload.single("photo"), signup); // Signup route
router.post("/login", login); // Login route

export default router;
