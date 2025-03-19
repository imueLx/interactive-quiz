"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaChild, FaBook, FaRegSmileBeam } from "react-icons/fa";

export default function QuizSelectionForm() {
  const [studentData, setStudentData] = useState({
    name: "",
    age: "",
    grade: "",
    rule: "",
  });
  const [topics, setTopics] = useState([]);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Fetch topics from the API endpoint on mount.
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

  // Initialize studentData.
  useEffect(() => {
    const savedData = localStorage.getItem("studentData");
    let initialData = {
      name: "",
      age: "",
      grade: "",
      rule: "",
      ...(savedData ? JSON.parse(savedData) : {}),
    };
    // Ensure the rule is always stored as a string.
    if (initialData.rule) {
      initialData.rule = String(initialData.rule);
    }
    setStudentData(initialData);
    setIsReturningUser(!!savedData);
  }, [topics]);

  const handleInputChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !studentData.name ||
      !studentData.age ||
      !studentData.grade ||
      !studentData.rule
    ) {
      setMessage("⚠️ Please fill in all fields before starting the quiz!");
      return;
    }

    // Convert topic.ruleNumber to string for comparison.
    const selectedTopic = topics.find(
      (topic) => String(topic.ruleNumber) === String(studentData.rule)
    );
    if (!selectedTopic) {
      setMessage("⚠️ Please select a valid topic!");
      return;
    }

    // Update studentData.rule to be the rule number (as a number) if needed.
    studentData.rule = selectedTopic.ruleNumber;
    localStorage.setItem("studentData", JSON.stringify(studentData));

    router.push("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Animated Header */}
          <div className="text-center mb-6">
            {isReturningUser ? (
              <div>
                <FaRegSmileBeam className="text-6xl text-yellow-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-3xl font-bold text-purple-600 mb-2">
                  Welcome Back, {studentData.name}! 🌟
                </h2>
                <p className="text-lg text-gray-600">
                  Ready for more learning fun? 🎉
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Let's Learn English! 🚀
                </h2>
                <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
                  <span className="animate-pulse">🌈</span>
                  Start your language adventure!
                  <span className="animate-pulse">🎒</span>
                </p>
              </div>
            )}
          </div>

          {/* Name Input */}
          <div className="bg-blue-100 p-4 rounded-2xl shadow-md">
            <label className="flex font-semibold text-lg mb-2 items-center gap-2 text-blue-600">
              <FaUser />
              Your Superhero Name:
            </label>
            <input
              type="text"
              placeholder="🦸 Enter your name"
              value={studentData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="w-full text-gray-600 p-3 border-2 border-blue-200 rounded-xl bg-white text-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Age Input */}
          <div className="bg-green-100 p-4 rounded-2xl shadow-md">
            <label className="flex font-semibold text-lg mb-2 items-center gap-2 text-green-600">
              <FaChild />
              Your Adventure Age:
            </label>
            <input
              type="number"
              min="7"
              max="60"
              placeholder="🎂 How old are you?"
              value={studentData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              required
              className="w-full text-gray-500 p-3 border-2 border-green-200 rounded-xl bg-white text-lg focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Grade Level Picker */}
          <div className="bg-yellow-100 p-4 rounded-2xl shadow-md">
            <label className="flex font-semibold text-lg mb-2 text-orange-600">
              🏫 Choose Your Grade Castle:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => handleInputChange("grade", num)}
                  className={`p-2 rounded-xl text-md font-bold transition-all shadow-md flex items-center justify-center gap-1
                    ${
                      studentData.grade == num
                        ? "bg-purple-500 text-white scale-105"
                        : "bg-white text-gray-700 hover:bg-purple-100"
                    }`}
                >
                  <span className="text-base">🏰</span>
                  Grade {num}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          <div className="bg-pink-100 p-4 rounded-2xl shadow-md">
            <label className="block font-semibold text-lg mb-2 items-center gap-2 text-pink-600">
              <FaBook />
              Choose Your Quest:
            </label>
            <select
              value={studentData.rule}
              onChange={(e) => handleInputChange("rule", e.target.value)}
              required
              className="w-full text-gray-700 p-3 border-2 border-pink-200 rounded-xl bg-white text-lg focus:ring-2 focus:ring-pink-300 appearance-none"
            >
              <option value="">🔍 Select a Learning Adventure</option>
              {topics.map((topic) => (
                <option key={topic._id} value={String(topic.ruleNumber)}>
                  {`Rule ${topic.ruleNumber}: ${topic.title}`}
                </option>
              ))}
            </select>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            className="w-full cursor-pointer py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-all group flex items-center justify-center gap-2"
          >
            <span className="text-2xl group-hover:animate-bounce">🚀</span>
            {isReturningUser ? "Continue Adventure!" : "Start Magic Learning!"}
            <span className="text-2xl group-hover:animate-bounce">✨</span>
          </button>

          {message && (
            <div className="text-center text-red-500 font-semibold animate-shake flex items-center justify-center gap-2">
              <span>⚠️</span>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
