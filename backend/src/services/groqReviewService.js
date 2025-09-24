const { Groq } = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.reviewAll = async (qaPairs, topic) => {
  const prompt = `
You are an expert technical interviewer. Your job is to evaluate the candidate with brutal honesty. 
Do not sugarcoat, exaggerate, or give polite feedback. Be very strict and realistic.  
If the candidate has no strengths, you must still include a "strengths" key with the value ["None"] (not an empty list).  
If answers are vague, incomplete, or wrong, mark them harshly. Do not give high scores unless the answers are genuinely excellent.

Topic: ${topic}

Here are the candidate's answers:
${qaPairs.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer || "No answer given"}`).join("\n\n")}

Provide the result ONLY in this JSON format:
{
  "strengths": ["point1", "point2"] or ["None"],
  "improvements": ["point1", "point2"],
  "feedback": "direct summary in 2-4 sentences, brutally honest",
  "score": integer between 0 and 100 (realistic, no generosity)
}
`;

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    return {
      strengths: ["None"],
      improvements: [],
      feedback: content,
      score: null,
    };
  }
};
