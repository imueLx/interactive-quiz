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

const quizTopics = [
  { id: "rule1", name: "Rule 1: Subjects & Verbs" },
  { id: "rule2", name: "Rule 2: Prepositional Phrases" },
  { id: "rule3", name: "Rule 3: Compound Subjects" },
  { id: "rule4", name: "Rule 4: There/Here Subjects" },
  { id: "rule5", name: "Rule 5: Question Subjects" },
  { id: "rule6", name: "Rule 6: And-Connected Subjects" },
  { id: "rule7", name: "Rule 7: Same Entity Subjects" },
  { id: "rule8", name: "Rule 8: Each/Every/No" },
  { id: "rule9", name: "Rule 9: Either/Or Subjects" },
  { id: "rule10", name: "Rule 10: Prepositional Quantities" },
  { id: "rule11", name: "Rule 11: Units of Measurement" },
  { id: "rule12", name: "Rule 12: Or/Nor with Plural Subjects" },
  { id: "rule13", name: "Rule 13: Mixed Or/Nor Subjects" },
  { id: "rule14", name: "Rule 14: Indefinite Pronouns" },
  { id: "rule15", name: "Rule 15: Plural Pronouns (Few, Many, Several)" },
  { id: "rule16", name: "Rule 16: Two Infinitives with 'And'" },
  { id: "rule17", name: "Rule 17: Gerunds as Subjects" },
  { id: "rule18", name: "Rule 18: Collective Nouns" },
  { id: "rule19", name: "Rule 19: Titles of Books, Movies, & Novels" },
  { id: "rule20", name: "Rule 20: Subject Determines the Verb" },
];

export default function ProgressPage() {
  const [quizResults, setQuizResults] = useState([]);
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [collapsedRules, setCollapsedRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quiz results on page load
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch("/api/results");
        const data = await response.json();
        setQuizResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchResults();
  }, []);

  const toggleCollapse = (ruleId) => {
    setCollapsedRules((prev) =>
      prev.includes(ruleId)
        ? prev.filter((r) => r !== ruleId)
        : [...prev, ruleId]
    );
  };

  const toggleExpanded = (topicId) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
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
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-xl border-2 border-gray-100 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-200 w-10 h-10"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            : quizTopics.map((topic, index) => {
                const IconComponent = ruleIcons[index].icon;
                const iconColor = ruleIcons[index].color;
                const topicResults = quizResults
                  .filter((r) => r.ruleId === topic.id)
                  .sort((a, b) => b.score - a.score);

                const showCount = expandedTopics.includes(topic.id) ? 10 : 3;
                const visibleResults = topicResults.slice(0, showCount);
                const isCollapsed = collapsedRules.includes(topic.id);

                return (
                  <div
                    key={topic.id}
                    className="bg-white p-3 rounded-xl border-2 border-gray-100"
                  >
                    {/* Rule Header with Fun Icon */}
                    <button
                      onClick={() => toggleCollapse(topic.id)}
                      className="w-full flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg bg-opacity-20 ${iconColor}`}
                        >
                          <IconComponent className={`text-2xl ${iconColor}`} />
                        </div>
                        <h2 className="text-left font-semibold text-gray-800">
                          {topic.name}
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
                                  {result.name}
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
                            onClick={() => toggleExpanded(topic.id)}
                            className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium pt-2"
                          >
                            <div className="inline-flex items-center gap-1">
                              {expandedTopics.includes(topic.id)
                                ? "Show less 🎈"
                                : "View more 🚀"}
                              <FaChevronDown
                                className={`transition-transform ${
                                  expandedTopics.includes(topic.id)
                                    ? "rotate-180"
                                    : ""
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
