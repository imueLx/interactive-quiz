"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { use } from "react";
import Loading from "./loading";

async function getQuestions(quizId) {
  // Determine the base URL based on the environment.
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL ||
        "https://interactive-english-quiz.vercel.app"
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/quizzes/${quizId}`, {
    cache: "no-store",
  });
  const response = await res.json();
  if (!response.success) throw new Error("Failed to fetch quiz");
  return response.data;
}

export default function QuestionsPage({ params }) {
  const unwrappedParams = use(params);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await getQuestions(unwrappedParams.quizId);
      setQuiz(data);
    };
    fetchQuiz();
  }, [unwrappedParams.quizId]);

  if (!quiz) {
    return <Loading />;
  }

  return (
    <div className="p-6 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Link
        href="/dashboard/"
        className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </Link>

      <h2 className="text-2xl font-semibold mb-4">
        {quiz.title} - Questions and Correct Answers
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {quiz.questions?.length > 0 ? (
          <ul className="space-y-4">
            {quiz.questions.map((q, index) => (
              <li
                key={index}
                className="p-4 border rounded-lg dark:border-gray-700"
              >
                <p className="text-lg font-medium dark:text-gray-300">
                  {q.question}
                </p>
                <div className="mt-2 space-y-1">
                  {q.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded ${
                        option === q.answer
                          ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No questions found for this quiz.
          </p>
        )}
      </div>
    </div>
  );
}
