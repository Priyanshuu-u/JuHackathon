import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import checklistRoutes from "./routes/checklistRoutes.js";
import chatRoutes from "./routes/chat.js"; // <--- new import

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Get current directory for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/chat", chatRoutes); // <--- mount the chat route

// Serve frontend build (if present) and handle SPA routing.
// Adjust the clientBuildPath if your frontend build is in a different location
// (e.g. ../client/build, ../frontend/build, or ./public). This only runs when
// the build folder exists on the same service as the backend.
const clientBuildPath = path.join(__dirname, "..", "frontend", "build");
if (fs.existsSync(clientBuildPath)) {
  console.log("Serving frontend from", clientBuildPath);
  app.use(express.static(clientBuildPath));
  // Send index.html for all non-API routes so client-side router can handle them
  app.get("*", (req, res) => {
    // If the request is for an API route, skip this handler
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  console.log("No frontend build found at", clientBuildPath, "- skipping static serving");
}

// Start server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
