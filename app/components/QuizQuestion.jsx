import React from "react";

const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  handleAnswer,
  handleNext,
  handleSubmit,
  selectedAnswers,
  quizTopics,
  ruleId,
  isSubmitting,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

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
              {currentQuestion + 1}/{totalQuestions}
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

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  Finish! 🎉
                  <span className="text-xl">🏆</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
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
};

export default QuizQuestion;
