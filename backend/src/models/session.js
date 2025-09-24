const mongoose = require("mongoose");

// Individual Question schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// Session schema
const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },                // ✅ Firebase UID
  topics: { type: [String], required: true, default: ["General"] }, // default topic if none provided
  questions: { type: [questionSchema], default: [] },       // array of questions with answers
  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  feedback: { type: String, default: "" },
  score: { type: Number, default: 0 },
  finalized: { type: Boolean, default: false },           // track if session is finalized
}, { timestamps: true }); // ✅ adds createdAt and updatedAt automatically

module.exports = mongoose.model("Session", sessionSchema);
