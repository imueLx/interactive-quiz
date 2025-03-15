import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const QuizResults = ({ selectedAnswers, questions, quizTopics, ruleId }) => {
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
};

export default QuizResults;
