"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPuzzlePiece } from "react-icons/fa";

// Define a list of color classes to cycle through
const colorClasses = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-lime-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-fuchsia-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-blue-400",
  "bg-green-400",
  "bg-purple-400",
  "bg-yellow-400",
  "bg-pink-400",
];

export default function QuizzesPage() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch topics from the /api/get-title endpoint on mount.
  useEffect(() => {
    async function loadTopics() {
      setLoading(true);
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
      setLoading(false);
    }
    loadTopics();
  }, []);

  // Handle topic selection: store the selected rule in localStorage and navigate to /quiz.
  const handleTopicSelect = (topic) => {
    // Retrieve any existing studentData from localStorage.
    const storedData = localStorage.getItem("studentData");
    const studentData = storedData ? JSON.parse(storedData) : {};
    // Set the selected rule to the topic's _id.
    studentData.rule = topic.ruleNumber;
    localStorage.setItem("studentData", JSON.stringify(studentData));
    // Navigate to the static /quiz page.
    router.push("/start-quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 py-10 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6">
          🎯 Choose Your Quiz!
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Pick a fun grammar quiz and test your skills!
        </p>
      </div>

      {loading ? (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-300 p-6 rounded-3xl shadow-lg animate-pulse"
            >
              <div className="h-10 bg-gray-400 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-400 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            // Use the topic's ruleNumber (or index) to select a color.
            const ruleNum = Number(topic.ruleNumber) || index + 1;
            const colorClass =
              colorClasses[(ruleNum - 1) % colorClasses.length];

            return (
              <div
                key={topic._id}
                onClick={() => handleTopicSelect(topic)}
                className={`${colorClass} p-6 rounded-3xl shadow-lg text-white cursor-pointer transition-all hover:scale-105 hover:shadow-xl flex items-center gap-4`}
              >
                <FaPuzzlePiece className="text-4xl animate-spin-slow" />
                <span className="font-semibold text-lg">{`Rule ${topic.ruleNumber}: ${topic.title}`}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 cursor-pointer text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
