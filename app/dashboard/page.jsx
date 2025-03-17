"use client";

import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function QuizDashboard() {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: "Sample Quiz",
      ruleNumber: "Rule 1",
      description: "This is a sample quiz description.",
      questions: [
        {
          id: 1,
          text: "What is 2+2?",
          options: ["2", "3", "4", "5"],
          correctAnswer: "4",
        },
      ],
    },
  ]);

  const [results] = useState([
    { ruleNumber: "Rule 1", score: 8, name: "John Doe", age: 15, grade: "9th" },
    { ruleNumber: "Rule 2", score: 7, name: "Jane Doe", age: 14, grade: "8th" },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Quizzes</h2>
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="border p-4 rounded-lg mb-4">
              <h3 className="text-lg font-bold">{quiz.title}</h3>
              <p className="text-sm text-gray-600">
                Rule Number: {quiz.ruleNumber}
              </p>
              <p className="text-sm text-gray-700">{quiz.description}</p>
              <div className="mt-2 flex space-x-2">
                <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <FaEdit />
                </button>
                <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded mt-2 hover:bg-green-600">
            <FaPlus className="mr-2" /> Add Quiz
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          {results.map((result, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold">
                Rule Number: {result.ruleNumber}
              </p>
              <p className="text-sm">Score: {result.score}</p>
              <p className="text-sm">Name: {result.name}</p>
              <p className="text-sm">Age: {result.age}</p>
              <p className="text-sm">Grade: {result.grade}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
