"use client";
import React, { useEffect, useState } from "react";

const QuizIntro = ({ quizDetails, ruleId, startQuiz }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    async function loadTopics() {
      // Try to load topics from localStorage first.
      const stored = localStorage.getItem("quizTopics");
      if (stored) {
        setTopics(JSON.parse(stored));
      } else {
        try {
          const res = await fetch("/api/get-title");
          const data = await res.json();
          setTopics(data);
          localStorage.setItem("quizTopics", JSON.stringify(data));
        } catch (err) {
          console.error("Error fetching topics:", err);
        }
      }
    }
    loadTopics();
  }, []);

  // Look up the topic based on ruleId.
  // Assuming ruleId is in the format "ruleX" and topics have a numeric ruleNumber.
  const currentTopic = topics.find((t) => t.ruleNumber === ruleId) || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6 animate-pulse-slow">
      {/* Animated Mascot */}
      <div className="animate-bounce mb-8">
        <span className="text-6xl">🐻</span>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg bg-white p-8 rounded-[2rem] shadow-2xl text-center border-4 border-yellow-300 transform hover:scale-[1.02] transition-transform">
        {/* Sparkle Decorations */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="text-4xl animate-spin-slow">✨</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎉 Grammar Quest 🎉
        </h1>

        {/* Topic Card */}
        <div className="mb-6 p-4 bg-yellow-100 rounded-xl border-2 border-blue-300 inline-block">
          <div className="text-sm text-blue-600 font-semibold">
            Today's Challenge
          </div>
          <div className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            <span className="text-pink-500">📚</span>
            {currentTopic.title || "Mystery Mission"}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Ready for a word adventure? 🌟
          </p>
          <div className="bg-pink-50 p-4 rounded-xl border-2 border-dashed border-pink-200">
            <p className="text-gray-700 font-medium">
              {quizDetails.description}
            </p>
            <div className="mt-2 flex justify-center gap-2">
              {["📖", "✏️", "🎒"].map((emoji, i) => (
                <span key={i} className="animate-float">
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startQuiz}
          className="w-full cursor-pointer py-4 rounded-xl bg-gradient-to-r from-green-400 to-blue-400 text-white text-xl font-bold shadow-lg hover:scale-105 transition-all group flex items-center justify-center gap-2"
        >
          <span className="text-2xl group-hover:animate-bounce">🚀</span>
          Start Learning Adventure!
          <span className="text-2xl group-hover:animate-bounce">🌈</span>
        </button>
      </div>
    </div>
  );
};

export default QuizIntro;
