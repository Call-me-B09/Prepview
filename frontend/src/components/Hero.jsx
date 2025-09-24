'use client';

import { useNavigate } from "react-router-dom";
import DarkVeil from "./DarkVeil";

export default function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth"); // 👈 this should match your auth route
  };

  return (
    <div className="relative w-full min-h-screen text-white overflow-y-auto">
      {/* Fixed DarkVeil Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <DarkVeil />
      </div>

      {/* Universal Get Started Button */}
      <div className="fixed top-4 right-6 z-50">
        <button
          onClick={handleGetStarted}
          className="px-6 py-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold shadow-lg hover:bg-white/20 transition"
        >
          Get Started
        </button>
      </div>

       {/* Scrollable Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-32 space-y-32 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Left Content */}
        <div className="space-y-24">
          {/* Hero Intro */}
          <section>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Ace Your <span className="text-purple-400">Interviews</span> <br />
              with <span className="text-purple-400">Prepview</span>
            </h1>
            <p className="mt-6 text-xl text-gray-200 leading-relaxed max-w-lg">
              Prepview is your AI-powered <span className="font-semibold text-purple-300">interview practice companion</span>.
              Upload your CV, choose your role, and face realistic interview questions to sharpen your confidence and communication.
            </p>
          </section>

          {/* About Section */}
          <section>
            <h2 className="text-3xl font-semibold text-purple-300">Why Prepview?</h2>
            <p className="mt-4 text-lg text-gray-200 leading-relaxed max-w-lg">
              Job interviews can be stressful. Prepview simulates the experience by
              generating <span className="text-purple-400 font-medium">custom interview questions</span>
              based on your CV and chosen field, so you practice exactly what matters.
              Improve your <span className="font-semibold text-purple-300">answers, delivery, and confidence</span> before the real deal.
            </p>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-3xl font-semibold text-purple-300">What You Get</h2>
            <ul className="mt-4 space-y-3 text-lg text-gray-200 leading-relaxed list-disc pl-5">
              <li>AI-generated interview questions tailored to your CV</li>
              <li>Answer practice with real-time AI evaluation</li>
              <li>Mock interview mode with timers & voice answers</li>
              <li>Feedback on strengths and weaknesses</li>
              <li>Sharpen your skills for technical, HR, or domain-specific roles</li>
            </ul>
          </section>

          {/* Closing CTA */}
          <section className="pb-32">
            <h2 className="text-4xl font-bold text-purple-400">
              Land Your Dream Job with Prepview
            </h2>
            <p className="mt-4 text-lg text-gray-200 max-w-lg">
              Practice smarter, improve faster, and walk into interviews with confidence.
              Prepview makes sure you’re ready.
            </p>
            <button onClick={handleGetStarted} className="mt-6 px-8 py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold shadow-lg hover:bg-white/20 transition">
              Get Started
            </button>
          </section>
        </div>

        {/* Right Side Visuals (Centered & Bigger Logo) */}
        <div className="hidden md:flex items-center justify-center relative">
          <img
  src="/prepview.png"
  alt="Prepview Logo"
  className="fixed right-10 top-1/2 -translate-y-1/2 w-[36rem] h-auto 
    drop-shadow-[0_0_15px_rgba(168,85,247,1)]
    drop-shadow-[0_0_40px_rgba(168,85,247,0.9)]
    drop-shadow-[0_0_80px_rgba(168,85,247,0.8)]
    drop-shadow-[0_0_120px_rgba(168,85,247,0.6)]"
/>


        </div>
      </div>
    </div>
  );
}
