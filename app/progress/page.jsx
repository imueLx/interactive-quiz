"use client";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaPencilAlt,
  FaGraduationCap,
  FaFeather,
  FaLightbulb,
  FaStar,
  FaCat,
  FaTree,
  FaRocket,
  FaDragon,
  FaGlobe,
  FaMusic,
  FaAtom,
  FaBrain,
  FaBalanceScale,
  FaPenNib,
  FaChessKnight,
  FaPalette,
  FaMicroscope,
  FaScroll,
  FaUserCircle,
  FaSmile,
  FaUserNinja,
  FaUserAstronaut,
  FaUserSecret,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const ruleIcons = [
  { icon: FaBook, color: "text-blue-500" },
  { icon: FaPencilAlt, color: "text-green-500" },
  { icon: FaGraduationCap, color: "text-purple-500" },
  { icon: FaFeather, color: "text-pink-500" },
  { icon: FaLightbulb, color: "text-yellow-500" },
  { icon: FaStar, color: "text-orange-500" },
  { icon: FaCat, color: "text-red-500" },
  { icon: FaTree, color: "text-emerald-500" },
  { icon: FaRocket, color: "text-indigo-500" },
  { icon: FaDragon, color: "text-amber-600" },
  { icon: FaGlobe, color: "text-blue-700" },
  { icon: FaMusic, color: "text-purple-600" },
  { icon: FaAtom, color: "text-teal-500" },
  { icon: FaBrain, color: "text-gray-700" },
  { icon: FaBalanceScale, color: "text-yellow-600" },
  { icon: FaPenNib, color: "text-red-600" },
  { icon: FaChessKnight, color: "text-green-700" },
  { icon: FaPalette, color: "text-indigo-600" },
  { icon: FaMicroscope, color: "text-cyan-500" },
  { icon: FaScroll, color: "text-brown-500" },
];

const userIcons = [
  FaUserCircle,
  FaSmile,
  FaUserNinja,
  FaUserAstronaut,
  FaUserSecret,
];

const mockResults = [
  { studentName: "Alex", quizTopic: "Rule 1: Subjects & Verbs", score: 100 },
  { studentName: "Casey", quizTopic: "Rule 1: Subjects & Verbs", score: 95 },
  { studentName: "Riley", quizTopic: "Rule 1: Subjects & Verbs", score: 88 },
  { studentName: "Jamie", quizTopic: "Rule 1: Subjects & Verbs", score: 80 },
  {
    studentName: "Taylor",
    quizTopic: "Rule 2: Prepositional Phrases",
    score: 90,
  },
  { studentName: "Morgan", quizTopic: "Rule 3: Compound Subjects", score: 85 },
];

const quizTopics = [
  "Rule 1: Subjects & Verbs",
  "Rule 2: Prepositional Phrases",
  "Rule 3: Compound Subjects",
  "Rule 4: There/Here Subjects",
  "Rule 5: Question Subjects",
  "Rule 6: And-Connected Subjects",
  "Rule 7: Same Entity Subjects",
  "Rule 8: Each/Every/No",
  "Rule 9: Either/Or Subjects",
  "Rule 10: Prepositional Quantities",
  "Rule 11: Units of Measurement",
  "Rule 12: Or/Nor with Plural Subjects",
  "Rule 13: Mixed Or/Nor Subjects",
  "Rule 14: Indefinite Pronouns",
  "Rule 15: Plural Pronouns (Few, Many, Several)",
  "Rule 16: Two Infinitives with 'And'",
  "Rule 17: Gerunds as Subjects",
  "Rule 18: Collective Nouns",
  "Rule 19: Titles of Books, Movies, & Novels",
  "Rule 20: Subject Determines the Verb",
];

export default function ProgressPage() {
  const [quizResults, setQuizResults] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [collapsedRules, setCollapsedRules] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setQuizResults(mockResults);
    }, 500);
  }, []);

  const toggleCollapse = (rule) => {
    setCollapsedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  const toggleExpanded = (topic) => {
    setExpandedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const getRandomUserIcon = () => {
    const randomIndex = Math.floor(Math.random() * userIcons.length);
    return userIcons[randomIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
        {/* Header with Fun Icon */}
        <div className="mb-6 flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
          <div className="p-3 bg-white rounded-full shadow-md">
            <FaChartBar className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Grammar Adventure Progress 🚀
            <span className="block text-sm font-normal text-gray-600 mt-1">
              Collect all the grammar stars! ⭐
            </span>
          </h1>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 gap-2">
          {quizTopics.map((topic, index) => {
            const IconComponent = ruleIcons[index].icon;
            const iconColor = ruleIcons[index].color;
            const topicResults = quizResults
              .filter((r) => r.quizTopic === topic)
              .sort((a, b) => b.score - a.score);

            const showCount = expandedTopics.includes(topic) ? 10 : 3;
            const visibleResults = topicResults.slice(0, showCount);
            const isCollapsed = collapsedRules.includes(topic);

            return (
              <div
                key={topic}
                className="bg-white p-3 rounded-xl border-2 border-gray-100"
              >
                {/* Rule Header with Fun Icon */}
                <button
                  onClick={() => toggleCollapse(topic)}
                  className="w-full flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-opacity-20 ${iconColor}`}
                    >
                      <IconComponent className={`text-2xl ${iconColor}`} />
                    </div>
                    <h2 className="text-left font-semibold text-gray-800">
                      {topic}
                    </h2>
                  </div>
                  {isCollapsed ? (
                    <FaChevronDown className="text-gray-500" />
                  ) : (
                    <FaChevronUp className="text-gray-500" />
                  )}
                </button>

                {/* Collapsible Content */}
                {!isCollapsed && (
                  <div className="mt-3 space-y-3">
                    {visibleResults.map((result, idx) => {
                      const UserIcon = getRandomUserIcon();
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 group"
                        >
                          <div className="relative">
                            <UserIcon className="text-3xl text-gray-400 flex-shrink-0" />
                            <span className="absolute -right-1 -bottom-1 bg-white rounded-full p-0.5">
                              <div className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center">
                                <span className="text-white text-xs">
                                  {idx + 1}
                                </span>
                              </div>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-700 truncate">
                              {result.studentName}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 rounded-full bg-gray-200 w-full">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
                                  style={{ width: `${result.score}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {result.score}% 🌟
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {topicResults.length > 3 && (
                      <button
                        onClick={() => toggleExpanded(topic)}
                        className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium pt-2"
                      >
                        <div className="inline-flex items-center gap-1">
                          {expandedTopics.includes(topic)
                            ? "Show less 🎈"
                            : "View more 🚀"}
                          <FaChevronDown
                            className={`transition-transform ${
                              expandedTopics.includes(topic) ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                    )}

                    {topicResults.length === 0 && (
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-gray-600 text-sm">
                          No submissions yet - be the first! 🌟
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Fun Footer */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-center">
          <p className="text-sm text-gray-700">
            {collapsedRules.length > 0
              ? "Tap the icons to explore more! 🔍"
              : "Great work grammar explorers! 🎉"}
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <span className="text-xl">📚</span>
            <span className="text-xl">✨</span>
            <span className="text-xl">🎓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
