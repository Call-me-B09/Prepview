import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { auth } from "../firebase"; // import Firebase auth

export default function StepHistory({
  previousSessions,
  setPreviousSessions,
  setStep,
  selectedSession,
  setSelectedSession,
  getScoreColor,
}) {
  // Fetch sessions when history screen is opened
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/sessions?userId=${user.uid}`
        );
        setPreviousSessions(res.data.sessions || []);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
        toast.error("Failed to fetch sessions");
      }
    };

    // slight delay to ensure auth.currentUser is ready
    const timer = setTimeout(fetchSessions, 300);
    return () => clearTimeout(timer);
  }, [setPreviousSessions]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-white text-center">📜 Previous Sessions</h2>

      <div className="flex flex-col gap-4">
        {previousSessions.length === 0 && (
          <p className="text-gray-400 text-center">No sessions found</p>
        )}
        {previousSessions.map((s) => (
          <div
            key={s._id || Math.random()}
            className="bg-gray-900 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="text-gray-300 text-sm mb-1">
                  {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"} •{" "}
                  {Array.isArray(s.topics) ? s.topics.join(", ") : s.topic || "No topics"}
                </p>
                <p className="text-white font-semibold text-lg">
                  Score:{" "}
                  <span className={getScoreColor(s.score || 0)}>
                    {s.score || 0}/100
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(s)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
              >
                View Q&A
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(0)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md mt-4"
      >
        Back
      </button>

      {/* Q&A Modal */}
      {selectedSession && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl max-w-3xl w-full p-6 relative">
            <button
              onClick={() => setSelectedSession(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">
              Session Q&A (
              {Array.isArray(selectedSession.topics)
                ? selectedSession.topics.join(", ")
                : selectedSession.topic || "No topics"}
              )
            </h3>
            <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {selectedSession.questions?.map((q) => (
                <div
                  key={q._id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <p className="text-gray-200 font-medium mb-2">
                    Q: {q.question || "Question text missing"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    A: {q.answer || "No answer given"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
