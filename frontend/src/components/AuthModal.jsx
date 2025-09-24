'use client';

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DarkVeil from "./DarkVeil";
import Loading from "./LoadingOverlay"; // Your custom loading overlay

import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) navigate("/app");
    });
    return unsubscribe;
  }, [navigate]);

  // -------------------- Email/Password Auth --------------------
  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isLogin) {
        // Login
        try {
          userCredential = await signInWithEmailAndPassword(auth, emailTrimmed, password);
        } catch (err) {
          switch (err.code) {
            case "auth/user-not-found":
              setError("No account found with this email. Please sign up first.");
              break;
            case "auth/wrong-password":
              setError("Incorrect password. Please try again.");
              break;
            case "auth/invalid-email":
              setError("Invalid email address."); 
              break;
            case "auth/invalid-credential":
              setError("Invalid login credentials. Please check your email and password.");
              break;
            default:
              setError("Login failed: " + err.message);
          }
          setLoading(false);
          return;
        }
      } else {
        // Signup
        try {
          userCredential = await createUserWithEmailAndPassword(auth, emailTrimmed, password);
        } catch (err) {
          switch (err.code) {
            case "auth/email-already-in-use":
              setError("This email is already in use. Please login instead.");
              break;
            case "auth/invalid-email":
              setError("Invalid email address.");
              break;
            case "auth/weak-password":
              setError("Password should be at least 6 characters.");
              break;
            default:
              setError("Signup failed: " + err.message);
          }
          setLoading(false);
          return;
        }
      }

      

      navigate("/app");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Google Auth --------------------
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      navigate("/app");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Google login failed. Please try again or clear cookies.");
      } else {
        setError("Google login failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <DarkVeil />
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8 w-[380px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        {/* Email & Password */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleEmailAuth}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-800 font-semibold shadow-xl hover:opacity-90 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-sm text-gray-300">OR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Google OAuth */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleAuth}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 transition border border-white/30"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* Switch Login/Signup */}
        <p className="mt-6 text-center text-sm text-gray-300">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-400 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
