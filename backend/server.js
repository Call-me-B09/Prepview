const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ===== Import Routes =====
const pdfRoutes = require("./src/routes/pdfRoutes");
const audioRoutes = require("./src/routes/audioRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const sessionRoutes = require("./src/routes/sessionroutes");

// ===== API Routes =====
app.use("/api/pdf", pdfRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api", sessionRoutes);

// ===== Health Check =====
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

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
    process.exit(1);
  }
};
connectDB();

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("⚠️ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
