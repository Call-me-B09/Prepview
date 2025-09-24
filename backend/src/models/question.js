const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  topics: { type: [String], required: true },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  cvText: { type: String } // <-- add this if you want to store the CV with each question
});

module.exports = mongoose.model("Question", questionSchema);
