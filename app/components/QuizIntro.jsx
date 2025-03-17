import React from "react";
const quizTopics = [
  { id: "rule1", name: "Subjects & Verbs Must Agree", color: "bg-blue-500" },
  {
    id: "rule2",
    name: "Words Between Subject & Verb",
    color: "bg-green-500",
  },
  { id: "rule3", name: "Prepositional Phrases", color: "bg-purple-500" },
  { id: "rule4", name: "'There' & 'Here' Sentences", color: "bg-yellow-500" },
  {
    id: "rule5",
    name: "Questions & Subject Placement",
    color: "bg-pink-500",
  },
  { id: "rule6", name: "Compound Subjects ('and')", color: "bg-red-500" },
  {
    id: "rule7",
    name: "Same Entity Compound Subjects",
    color: "bg-teal-500",
  },
  {
    id: "rule8",
    name: "Each, Every, No - Singular Rule",
    color: "bg-orange-500",
  },
  {
    id: "rule9",
    name: "Singular Subjects with 'Or'/'Nor'",
    color: "bg-indigo-500",
  },
  {
    id: "rule10",
    name: "Prepositional Phrases & Quantifiers",
    color: "bg-lime-500",
  },
  { id: "rule11", name: "Units of Measurement", color: "bg-cyan-500" },
  {
    id: "rule12",
    name: "Plural Subjects with 'Or'/'Nor'",
    color: "bg-rose-500",
  },
  {
    id: "rule13",
    name: "Mixed Subjects with 'Or'/'Nor'",
    color: "bg-fuchsia-500",
  },
  { id: "rule14", name: "Indefinite Pronouns", color: "bg-violet-500" },
  {
    id: "rule15",
    name: "Plural Pronouns: Few, Many, Several",
    color: "bg-emerald-500",
  },
  {
    id: "rule16",
    name: "Two Infinitives Joined by 'And'",
    color: "bg-blue-400",
  },
  { id: "rule17", name: "Gerunds as Subjects", color: "bg-green-400" },
  { id: "rule18", name: "Collective Nouns", color: "bg-purple-400" },
  {
    id: "rule19",
    name: "Titles of Books, Movies, & Novels",
    color: "bg-yellow-400",
  },
  {
    id: "rule20",
    name: "Only the Subject Affects the Verb",
    color: "bg-pink-400",
  },
];

const QuizIntro = ({ quizDetails, ruleId, startQuiz }) => {
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
            {quizTopics.find((t) => t.id === ruleId)?.name || "Mystery Mission"}
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
