"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaRedo } from "react-icons/fa";

export default function QuizResults() {
  const [studentName, setStudentName] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [score, setScore] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Retrieve quiz data from localStorage
    const name = localStorage.getItem("studentName") || "Awesome Student";
    const topic = localStorage.getItem("quizType") || "Unknown Topic";
    const rawScore = parseInt(localStorage.getItem("quizScore")) || 0;
    const totalQuestions =
      parseInt(localStorage.getItem("totalQuestions")) || 1;

    // Convert raw score to 100-point scale
    const finalScore = Math.round((rawScore / totalQuestions) * 100);

    setStudentName(name);
    setQuizTopic(topic);
    setScore(finalScore);
  }, []);

  // Determine background color based on score
  const getBackgroundColor = () => {
    if (score === 100) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Generate encouraging message based on score
  const getEncouragingMessage = () => {
    if (score === 100) {
      return "🏅 Perfect Score! You’re a true grammar champion! 🏆";
    } else if (score >= 80) {
      return "✨ Great Work! You're getting better every day! 💪";
    } else if (score >= 50) {
      return "⭐ Nice Effort! Keep practicing and you'll master it! 😊";
    } else {
      return "🚀 Don't Give Up! Every mistake helps you learn! Try Again!";
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${getBackgroundColor()} p-6 relative`}
    >
      {/* Confetti Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="animate-confetti"></div>
      </div>

      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-2xl text-gray-900 text-center relative z-10 animate-pop-in">
        {/* 3D Trophy Animation */}
        <div className="text-7xl text-yellow-400 animate-bounce mb-6">🏆</div>

        {/* Results Header */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          🎉 Amazing Job, {studentName}!
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          You completed the{" "}
          <strong className="text-blue-600">{quizTopic}</strong> quiz.
        </p>

        {/* Score Display */}
        <div className="text-6xl font-extrabold text-gray-900 mt-6 mb-4">
          {score} / 100
        </div>

        {/* Encouraging Message */}
        <p className="text-lg font-semibold text-gray-700 mt-4 mb-6">
          {getEncouragingMessage()}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-bold shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
          >
            <FaHome /> Go Home
          </button>

          <button
            onClick={() => router.push(`/quiz/${quizTopic}`)}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 text-white text-lg font-bold shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
