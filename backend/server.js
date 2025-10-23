import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import checklistRoutes from "./routes/checklistRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount existing API routes first
app.use("/api/auth", authRoutes);
app.use("/api/checklists", checklistRoutes);

// Try to mount chat route if it exists (keeps server robust if file not yet added)
try {
  const chatRoutes = (await import('./routes/chat.js')).default;
  app.use("/api/chat", chatRoutes);
} catch (err) {
  console.warn('No /api/chat route found (skip mounting):', err.message);
}

// Serve frontend build (Vite -> frontend/dist). Adjust if your build folder differs.
const possibleBuildDirs = [
  path.join(__dirname, "..", "frontend", "dist"),
  path.join(__dirname, "..", "frontend", "build"),
  path.join(__dirname, "..", "build")
];

import fs from 'fs';
let buildPath = null;
for (const p of possibleBuildDirs) {
  if (fs.existsSync(p)) {
    buildPath = p;
    break;
  }
}

if (buildPath) {
  app.use(express.static(buildPath));
  // SPA fallback: serve index.html for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // If no build present, keep API routes working and return helpful message for other requests
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.send('<h2>Frontend build not found</h2><p>Run frontend build (vite build) and place output in frontend/dist.</p>');
  });
}

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
