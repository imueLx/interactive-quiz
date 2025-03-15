"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTrophy,
  FaPlay,
} from "react-icons/fa";

const quizTopics = [
  { id: "rule1", name: "Subjects & Verbs Must Agree" },
  { id: "rule2", name: "Words Between Subject & Verb" },
  { id: "rule3", name: "Prepositional Phrases" },
  { id: "rule4", name: "'There' & 'Here' Sentences" },
  { id: "rule5", name: "Questions & Subject Placement" },
  { id: "rule6", name: "Compound Subjects ('and')" },
  { id: "rule7", name: "Same Entity Compound Subjects" },
  { id: "rule8", name: "Each, Every, No - Singular Rule" },
  { id: "rule9", name: "Singular Subjects with 'Or'/'Nor'" },
  { id: "rule10", name: "Prepositional Phrases & Quantifiers" },
  { id: "rule11", name: "Units of Measurement" },
  { id: "rule12", name: "Plural Subjects with 'Or'/'Nor'" },
  { id: "rule13", name: "Mixed Subjects with 'Or'/'Nor'" },
  { id: "rule14", name: "Indefinite Pronouns" },
  { id: "rule15", name: "Plural Pronouns: Few, Many, Several" },
  { id: "rule16", name: "Two Infinitives Joined by 'And'" },
  { id: "rule17", name: "Gerunds as Subjects" },
  { id: "rule18", name: "Collective Nouns" },
  { id: "rule19", name: "Titles of Books, Movies, & Novels" },
  { id: "rule20", name: "Only the Subject Affects the Verb" },
];

export default function QuizPage() {
  const { rule } = useParams();
  const ruleId = `rule${rule}`;
  const [currentQuestion, setCurrentQuestion] = useState(-1); // Start at -1 for intro screen
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizDetails, setQuizDetails] = useState({});

  const [showIntro, setShowIntro] = useState(true);

  // Updated API call to use your endpoint
  const fetchQuizQuestions = async (rule) => {
    try {
      const response = await fetch(`/api/questions?ruleNumber=${rule}`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuizDetails(data);
      return data.questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        answer: q.answer,
      }));
    } catch (error) {
      throw new Error("Failed to load questions. Please try again!");
    }
  };

  useEffect(() => {
    if (!rule) {
      setError("Invalid quiz ID format");
      setLoading(false);
      return;
    }

    const loadQuestions = async () => {
      try {
        const data = await fetchQuizQuestions(rule);

        // Shuffle questions
        const shuffledQuestions = shuffleArray([...data]);

        setQuestions(shuffledQuestions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [rule]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const startQuiz = () => {
    setShowIntro(false);
    setCurrentQuestion(0);
  };

  const handleAnswer = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const handleSubmit = () => {
    setQuizCompleted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
        {/* Topic Skeleton */}
        <div className="mb-6 w-48 h-6 bg-gray-300 rounded animate-pulse"></div>

        {/* Card Skeleton */}
        <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl text-gray-900 relative">
          {/* Progress Bar Skeleton */}
          <div className="w-full bg-gray-200 h-4 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gray-300 animate-pulse"></div>
          </div>

          {/* Question Number Skeleton */}
          <div className="w-40 h-6 bg-gray-300 rounded mb-4 animate-pulse mx-auto"></div>

          {/* Question Text Skeleton */}
          <div className="w-full h-12 bg-gray-300 rounded mb-6 animate-pulse"></div>

          {/* Options Skeleton */}
          <div className="grid gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="w-full h-12 bg-gray-300 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* Buttons Skeleton */}
          <div className="flex justify-between mt-6">
            <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  if (showIntro && !loading && !error) {
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
              {quizTopics.find((t) => t.id === ruleId)?.name ||
                "Mystery Mission"}
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
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
        <div className="text-2xl text-red-600 font-bold p-8 bg-white rounded-xl shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = questions.filter(
      (q, index) => selectedAnswers[index] === q.answer
    ).length;
    const scorePercentage = (correctAnswers / questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-6 animate-pulse-slow">
        {/* Confetti Animation */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-8">
          {["🎉", "🎈", "✨"].map((e, i) => (
            <span key={i} className="text-3xl animate-float">
              {e}
            </span>
          ))}
        </div>

        <div className="w-full max-w-2xl bg-white p-8 rounded-[2rem] shadow-2xl border-4 border-yellow-300">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="animate-bounce mb-4">
              <span className="text-6xl">🏆</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {scorePercentage === 100 ? "Perfect Score! 🌟" : "Great Job! 🎉"}
            </h1>
            <div className="text-xl text-gray-600 font-medium">
              You completed{" "}
              {quizTopics.find((t) => t.id === ruleId)?.name || "the quiz"}!
            </div>
          </div>

          {/* Score Summary */}
          <div className="mb-8 p-6 bg-blue-50 rounded-xl text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {correctAnswers}/{questions.length}
            </div>
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl ${
                    i < Math.round(scorePercentage / 20)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all"
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="space-y-6">
            {questions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.answer;

              return (
                <div
                  key={index}
                  className="p-5 rounded-xl border-2 border-dashed relative overflow-hidden"
                >
                  {/* Result Indicator */}
                  <div
                    className={`absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center ${
                      isCorrect
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span className="text-2xl">{isCorrect ? "✅" : "❌"}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      Question {index + 1}
                    </span>
                    <span className="text-sm text-pink-500">
                      {question.subject}
                    </span>
                  </div>

                  <h3 className="text-xl text-black font-semibold mb-4 bg-blue-50 p-3 rounded-lg">
                    {question.question}
                  </h3>

                  <div className="grid gap-2 text-black">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                          option === question.answer
                            ? "bg-green-100 border-2 border-green-400"
                            : selectedAnswers[index] === option
                            ? "bg-red-100 border-2 border-red-400"
                            : "bg-gray-50 border-2 border-gray-200"
                        }`}
                      >
                        <span className="text-lg ">
                          {["🟢", "🔵", "🟡", "🔴"][optIndex % 4]}
                        </span>
                        {option}
                        {option === question.answer && (
                          <FaCheckCircle className="ml-auto text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🏠</span>
            Back to Quiz Menu
            <span className="text-2xl">🎮</span>
          </button>
        </div>

        {/* Floating Animals */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8">
          {["🐻", "🐰", "🐨"].map((e, i) => (
            <span key={i} className="text-3xl animate-float-delay">
              {e}
            </span>
          ))}
        </div>
      </div>
    );
  }
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  // quiz card
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-100 to-blue-100 p-6 animate-pulse-slow">
      {/* Animated Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-2 drop-shadow-md">
          🎓 Grammar Adventure
        </h1>
        <div className="text-xl font-bold text-pink-600 flex items-center justify-center gap-2">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full animate-float">
            🌟 Current Quest:{" "}
            {quizTopics.find((t) => t.id === ruleId)?.name || "Mystery Topic"}
          </span>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="w-full max-w-lg bg-white p-8 rounded-[2rem] shadow-2xl relative border-4 border-blue-400 transform hover:scale-[1.01] transition-transform">
        {/* Progress Indicator */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between text-lg">
            <span className="text-blue-600 font-bold">🚀 Progress:</span>
            <span className="text-pink-600 font-bold">
              {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Box */}
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
            🧩 {question?.question}
          </h2>

          {/* Answer Buttons */}
          <div className="grid gap-4">
            {question?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-lg font-bold rounded-xl shadow-md transition-all transform
                  ${
                    selectedAnswers[currentQuestion] === option
                      ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white scale-105 ring-4 ring-yellow-300"
                      : "bg-white text-gray-800 hover:scale-105 hover:bg-blue-50 border-2 border-blue-200"
                  }`}
              >
                <span className="mr-2">
                  {
                    ["🟢", "🔵", "🟡", "🔴"][index % 4] // Rotating colorful markers
                  }
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            className="px-6 py-3 bg-blue-400 text-white rounded-xl font-bold shadow-lg hover:bg-blue-500 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <span className="text-xl">👈</span>
            Back
          </button>

          <div className="text-sm mx-2 text-gray-500 font-bold">
            {
              ["Easy Peasy!", "You Got This!", "Keep Going!", "Almost There!"][
                currentQuestion % 4
              ]
            }
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              Finish! 🎉
              <span className="text-xl">🏆</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="px-6 py-3 bg-pink-400 text-white rounded-xl font-bold shadow-lg hover:bg-pink-500 transition-all flex items-center gap-2"
            >
              Next
              <span className="text-xl">👉</span>
            </button>
          )}
        </div>

        {/* Fun Bottom Decoration */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-4">
          {["🐶", "📚", "✏️", "🎈"].map((emoji, i) => (
            <span key={i} className="text-2xl animate-float">
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
