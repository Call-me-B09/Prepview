const { transcribeAudio } = require("../services/assemblyservice");
const Question = require("../models/question");

async function uploadAudioAnswer(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const questionId = req.body.questionId;
    if (!questionId) {
      return res.status(400).json({ error: "Missing questionId" });
    }

    console.log("📥 Received Question ID:", questionId);

    // Step 1: Transcribe using AssemblyAI
    const transcript = await transcribeAudio(req.file.buffer);
    console.log("📝 Transcript:", transcript);

    // Step 2: Update the question's answer field in DB
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer: transcript },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    console.log("✅ Answer saved in DB:", updatedQuestion);

    // Send back updated question object
    return res.json({
      success: true,
      question: updatedQuestion
    });

  } catch (error) {
    console.error("❌ Error in uploadAudioAnswer:", error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = { uploadAudioAnswer };
