"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaUser, FaChild, FaBook, FaRegSmileBeam } from "react-icons/fa";

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

export default function QuizSelectionForm() {
  const [studentData, setStudentData] = useState({
    name: "",
    age: "",
    grade: "",
    quizType: "",
  });
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedData = localStorage.getItem("studentData");
    const urlTopic = searchParams.get("topic"); // Get topic from URL

    // Initialize with default values
    const initialData = {
      name: "",
      age: "",
      grade: "",
      quizType: "",
      ...(savedData ? JSON.parse(savedData) : {}),
    };

    // Preselect topic from URL if available and valid
    if (urlTopic && quizTopics.some((topic) => topic.id === urlTopic)) {
      initialData.quizType = urlTopic;
    }

    setStudentData(initialData);
    setIsReturningUser(!!savedData);
  }, [searchParams]); // Add searchParams to dependency array

  const handleInputChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !studentData.name ||
      !studentData.age ||
      !studentData.grade ||
      !studentData.quizType
    ) {
      setMessage("⚠️ Please fill in all fields before starting the quiz!");
      return;
    }

    const userData = {
      ...studentData,
      lastAccessed: new Date().toISOString(),
    };

    localStorage.setItem("studentData", JSON.stringify(userData));
    const ruleNumber = studentData.quizType.replace("rule", ""); // Extracts number
    // Proper URL creation
    const params = new URLSearchParams();
    params.set("rule", ruleNumber);
    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl border-4 border-yellow-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Animated Header */}
          <div className="text-center mb-6">
            {isReturningUser ? (
              <div className="">
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

          {/* Name Input with Character */}
          <div className="bg-blue-100 p-4 rounded-2xl shadow-md">
            <label className="flex  font-semibold text-lg mb-2  items-center gap-2 text-blue-600">
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

          {/* Age Input with Fun Visual */}
          <div className="bg-green-100 p-4 rounded-2xl shadow-md">
            <label className="flex font-semibold text-lg mb-2  items-center gap-2 text-green-600">
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
            <label className="block font-semibold text-lg mb-2  items-center gap-2 text-pink-600">
              <FaBook />
              Choose Your Quest:
            </label>
            <select
              value={studentData.quizType}
              onChange={(e) => handleInputChange("quizType", e.target.value)}
              required
              className="w-full text-gray-700 p-3 border-2 border-pink-200 rounded-xl bg-white text-lg focus:ring-2 focus:ring-pink-300 appearance-none"
            >
              <option value="">🔍 Select a Learning Adventure</option>
              {quizTopics.map((topic) => (
                <option
                  key={topic.id}
                  value={topic.id}
                  className="flex items-center gap-2"
                >
                  {topic.name}
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
