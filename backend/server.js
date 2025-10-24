import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
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

// ...existing imports and middleware

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/chat", chatRoutes); // <--- mount the chat route

// If you build your frontend into a folder (e.g. ../frontend/build), serve it and handle SPA routing:
import express from 'express';
const clientBuildPath = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
