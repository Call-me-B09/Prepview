// StepResults.jsx
import React from "react";

export default function StepResults({
  mockScore,
  setStep,
  setTopics,
  setQuestions,
  setCurrentQuestionIndex,
  setCvFile,
  setMockScore,
}) {
  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const handleStartAnother = () => {
    setStep(1); // back to interview step
    setMockScore(null);
    setTopics([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCvFile(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      <h2 className="text-3xl text-green-400 font-bold text-center">
        🎉 Mock Interview Results
      </h2>
      <p className="text-gray-300 text-center text-lg">
        Score: <span className={getScoreColor(mockScore.score)}>{mockScore.score}/100</span>
      </p>

      <div className="bg-gray-900 rounded-lg p-6">
        <p className="text-lg text-gray-300 font-medium">✅ Strengths</p>
        <ul className="list-disc list-inside text-gray-400 text-sm mb-4">
          {(mockScore.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <p className="text-lg text-gray-300 font-medium">⚠ Improvements</p>
        <ul className="list-disc list-inside text-gray-400 text-sm mb-4">
          {(mockScore.improvements || []).map((im, i) => <li key={i}>{im}</li>)}
        </ul>

        <p className="text-lg text-gray-300 font-medium">💡 Feedback</p>
        <p className="text-gray-400 text-sm">{mockScore.feedback}</p>
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={() => setStep(0)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        >
          Back to Menu
        </button>
        <button
          onClick={handleStartAnother}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
        >
          Start Another Interview
        </button>
      </div>
    </div>
  );
}
