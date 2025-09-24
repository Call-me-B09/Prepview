const Question = require("../models/question");
const Session = require("../models/session");
const { reviewAll } = require("../services/groqReviewService");

exports.createSessionFromQuestions = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all questions
    const questions = await Question.find();
    if (questions.length === 0) {
      return res.status(400).json({ error: "No questions found" });
    }

    // Normalize answers
    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      answer: q.answer && q.answer.trim() !== "" ? q.answer : "No answer given",
    }));

    // Handle topics (expect array from frontend, fallback to ["General"])
    const topics = Array.isArray(req.body.topics) && req.body.topics.length > 0
      ? req.body.topics
      : ["General"];

    // Generate review using Groq
    const review = await reviewAll(formattedQuestions, topics.join(", "));

    // Create new session with userId
    const session = new Session({
      userId, // ✅ associate session with Firebase UID
      topics,
      questions: formattedQuestions,
      strengths: review.strengths || [],
      improvements: review.improvements || [],
      feedback: review.feedback || "",
      score: typeof review.score === "number" ? review.score : 0,
      finalized: true,
    });

    await session.save();

    // Clear Question collection
    await Question.deleteMany();

    res.json({
      message: "Session created and questions reviewed",
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating session from questions" });
  }
};
