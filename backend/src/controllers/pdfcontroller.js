const { extractPdfText } = require("../services/pdfservice.js");
const { processPdfWithGroq } = require("../services/groqservice.js");
const Question = require("../models/question.js");

async function uploadPdf(req, res) {
  try {
    let cvText = "";
    let topics = [];

    console.log("------[UPLOAD PDF DEBUG START]------");
    console.log("Raw req.body:", req.body);
    console.log("Raw req.file:", req.file ? "File uploaded" : "No file");

    // Parse topics from frontend
    if (req.body.topics) {
      try {
        console.log("Raw topics from req.body.topics:", req.body.topics);
        topics = JSON.parse(req.body.topics);
        console.log("Parsed topics array:", topics);
      } catch (err) {
        console.error("❌ Error parsing topics:", err);
        topics = [];
      }
    }

    // Fallback
    if (!Array.isArray(topics) || topics.length === 0) {
      console.warn("⚠️ Topics missing or invalid, using fallback: ['general']");
      topics = ["general"];
    }

    // Step 1: Extract CV text if file uploaded
    if (req.file) {
      const result = await extractPdfText(req.file.buffer);
      cvText = result.text;
      console.log("✅ Extracted PDF Text length:", cvText.length);
      console.log("✅ Number of pages:", result.numPages);
    } else {
      console.log("⚠️ No CV uploaded, proceeding with topics only.");
    }

    // Step 2: Generate only 5 questions for ALL topics combined
    console.log("➡️ Calling Groq service with topics:", topics);
    const generatedQuestions = await processPdfWithGroq(cvText, topics);
    console.log("✅ Generated questions:", generatedQuestions);

    // Step 3: Save to DB
    const docsToSave = generatedQuestions.map((q) => ({
      topics,   // store array of topics
      question: q,
      answer: "",
    }));

    console.log("➡️ Docs to be inserted into DB:", docsToSave);

    const savedQuestions = await Question.insertMany(docsToSave);
    console.log("✅ Saved to DB:", savedQuestions);

    // Step 4: Respond
    console.log("------[UPLOAD PDF DEBUG END]------");

    res.json({
      cvText,
      topics,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error("❌ Upload PDF Error:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { uploadPdf };
