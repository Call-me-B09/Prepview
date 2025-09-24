const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json()); // Parse JSON requests

// Enable CORS for frontend (Vite runs on :5173)
app.use(cors({
  origin: "http://localhost:5173", // Allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true // If you use cookies/auth
}));

// ===== Import Routes =====
const pdfRoutes = require("./src/routes/pdfRoutes");
const audioRoutes = require("./src/routes/audioRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const sessionRoutes = require("./src/routes/sessionroutes"); // Added session routes

// ===== API Routes =====
app.use("/api/pdf", pdfRoutes);       // e.g. POST /api/pdf/upload
app.use("/api/audio", audioRoutes);   // e.g. POST /api/audio/upload
app.use("/api/review", reviewRoutes); // e.g. GET /api/review/sessions
app.use("/api", sessionRoutes); // e.g. GET /api/sessions

// ===== Database Connection =====
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process on DB failure
  }
};
connectDB();

// ===== Health Check =====
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
