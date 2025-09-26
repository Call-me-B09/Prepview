'use client';

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import toast from "react-hot-toast";
import { User } from "lucide-react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import DarkVeil from "./components/DarkVeil";
import StepMenu from "./components/StepMenu";
import StepCVUpload from "./components/StepCVUpload";
import StepTopics from "./components/StepTopics";
import StepInterview from "./components/StepInterview";
import StepResults from "./components/StepResults";
import StepHistory from "./components/StepHistory";
import Hero from "./components/Hero";
import Auth from "./components/AuthModal";

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// -------------------- PrepviewApp Component --------------------
function PrepviewApp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cvFile, setCvFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [mockScore, setMockScore] = useState(null);
  const [previousSessions, setPreviousSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  const [showMenu, setShowMenu] = useState(false);

  // -------------------- User Logout --------------------
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  // -------------------- Start Interview --------------------
  const handleStartInterview = async () => {
    if (topics.length === 0) return toast.error("Please select at least one topic");

    const formData = new FormData();
    if (cvFile) formData.append("file", cvFile);
    formData.append("topics", JSON.stringify(topics));

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/pdf/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setQuestions(res.data.questions || []);
      toast.success("Topics & CV uploaded successfully!");
      setStep(3); // go to interview
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Toggle Recording --------------------
  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });

        if (questions[currentQuestionIndex]) {
          const formData = new FormData();
          formData.append("audio", blob);
          formData.append("questionId", questions[currentQuestionIndex]._id);

          try {
            setLoading(true);
            const res = await axios.post(
              `${API_URL}/api/audio/upload-audio`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );

            const updatedQuestions = [...questions];
            updatedQuestions[currentQuestionIndex].answer = res.data.answer;
            setQuestions(updatedQuestions);
          } catch (err) {
            console.error("Audio upload failed", err);
            toast.error("Audio upload failed");
          } finally {
            setLoading(false);
          }
        }

        // move to next question or finish
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((i) => i + 1);
        } else {
          try {
            setLoading(true);
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error("User not authenticated");

            const sessionRes = await axios.post(
              `${API_URL}/api/review/create-session`,
              { topics, questions, userId }
            );

            const session = sessionRes.data.session;
            setMockScore({
              score: session.score,
              feedback: session.feedback,
              strengths: session.strengths || [],
              improvements: session.improvements || [],
            });

            setStep(4); // results
            setPreviousSessions((prev) => [session, ...prev]);
          } catch (err) {
            console.error("Session creation failed", err);
            toast.error("Session creation failed");
          } finally {
            setLoading(false);
          }
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
    } else {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  // -------------------- Reset Interview --------------------
  const handleResetInterview = () => {
    setStep(1); // go back to CV upload step
    setCvFile(null);
    setTopic("");
    setTopics([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setMockScore(null);
  };

  // -------------------- Helpers --------------------
  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  // -------------------- JSX --------------------
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DarkVeil />
      <Toaster position="top-right" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black/70 text-white">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-600 rounded-full mb-4 animate-spin" />
          <p className="text-lg">Please wait...</p>
        </div>
      )}

      {/* User Icon */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white shadow"
        >
          <User size={24} />
        </button>

        {showMenu && auth.currentUser && (
          <div className="absolute right-0 mt-2 w-max bg-gray-800 text-white rounded-lg shadow-lg flex flex-col">
            <p className="px-4 py-2 border-b border-gray-600 whitespace-nowrap text-sm">
              {auth.currentUser.email}
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-red-600 rounded-b-lg text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Center Card */}
      <div className="absolute inset-0 flex justify-center items-center px-4">
        <div className="bg-gray-950/85 backdrop-blur-2xl border border-gray-800 rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
          <h1 className="text-4xl text-white font-bold text-center mb-6">PREPVIEW</h1>

          {step === 0 && <StepMenu setStep={setStep} />}
          {step === 1 && <StepCVUpload setStep={setStep} cvFile={cvFile} setCvFile={setCvFile} />}
          {step === 2 && (
            <StepTopics
              topic={topic}
              setTopic={setTopic}
              topics={topics}
              setTopics={setTopics}
              handleStartInterview={handleStartInterview}
            />
          )}
          {step === 3 && questions.length > 0 && (
            <StepInterview
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              toggleRecording={toggleRecording}
              isRecording={isRecording}
              setStep={setStep}
            />
          )}
          {step === 4 && mockScore && (
            <StepResults
              mockScore={mockScore}
              setStep={setStep}
              setTopics={setTopics}
              setQuestions={setQuestions}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              setCvFile={setCvFile}
              setMockScore={setMockScore}
              handleResetInterview={handleResetInterview}
            />
          )}
          {step === "history" && (
            <StepHistory
              previousSessions={previousSessions}
              setPreviousSessions={setPreviousSessions}
              setStep={setStep}
              selectedSession={selectedSession}
              setSelectedSession={setSelectedSession}
              getScoreColor={getScoreColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------- Protected Route --------------------
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-white text-center mt-20">Checking auth...</p>;
  if (!user) return <Navigate to="/auth" />;
  return children;
}

// -------------------- Main App --------------------
export default function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <PrepviewApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
