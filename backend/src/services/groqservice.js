const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function processPdfWithGroq(pdfText, topics) {
  const limitedText = pdfText ? pdfText.slice(0, 8000) : "";

  // Handle array or string for topics
  const topicsText = Array.isArray(topics) ? topics.join(", ") : topics || "general";

  const prompt = `
You are an expert interviewer.

⚠️ IMPORTANT: Output must ONLY be the 5 interview questions, numbered 1–5.
Do NOT include introductions, summaries, explanations, or extra text.

Rules:
- Generate exactly 5 interview questions based on ALL provided topics and CV text.
- If the CV mentions a candidate name, include that name in the questions.
- If no name is present, keep the questions generic (do NOT invent a name).
- If the CV text is empty, generate 5 strong questions from the topics alone.
- Do NOT write anything except the questions.

Format:
1. <first question>
2. <second question>
3. <third question>
4. <fourth question>
5. <fifth question>

CV Text (may be empty):
${limitedText || "[No CV provided]"}

Topics: ${topicsText}
`;

  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are an expert interview assistant. Only output questions, no explanations.",
      },
      { role: "user", content: prompt },
    ],
  });

  const rawText = chatCompletion.choices[0].message.content || "";

  // Parse and clean questions
  let questions = rawText
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);

  return questions.slice(0, 5); // ensure exactly 5
}

module.exports = { processPdfWithGroq };
