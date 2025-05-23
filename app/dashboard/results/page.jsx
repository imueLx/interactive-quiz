"use client";

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Skeleton Loader Components
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="animate-pulse h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
);

const ResultsDashboard = () => {
  const [results, setResults] = useState([]);
  const [difficultRules, setDifficultRules] = useState([]);
  const [easiestRules, setEasiestRules] = useState([]);
  const [topDifficultQuestions, setTopDifficultQuestions] = useState([]);
  const [topEasiestQuestions, setTopEasiestQuestions] = useState([]);
  const [ageInsights, setAgeInsights] = useState({ insights: [], stats: null });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/detailed-results");
      const data = await response.json();
      const formattedData = data.map((entry) => ({
        ...entry,
        correct: entry.results.filter((q) => q.isCorrect).length,
        incorrect:
          entry.results.length -
          entry.results.filter((q) => q.isCorrect).length,
      }));
      setResults(formattedData);
      analyzeDifficulties(formattedData);
      analyzeAges(formattedData);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteResult = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      const response = await fetch(`/api/results/${resultId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedResults = results.filter(
          (result) => result._id !== resultId
        );
        setResults(updatedResults);
        analyzeDifficulties(updatedResults);
        analyzeAges(updatedResults);
      }
    }
  };

  const analyzeDifficulties = (data) => {
    const ruleStats = {};
    const ruleQuestionMap = {};
    const allQuestions = [];
    const correctQuestions = [];

    data.forEach((entry) => {
      entry.results.forEach((q) => {
        if (!q.isCorrect) {
          ruleStats[entry.ruleId] = (ruleStats[entry.ruleId] || 0) + 1;

          const existingQuestion = allQuestions.find(
            (item) => item.question === q.question
          );
          if (existingQuestion) {
            existingQuestion.count++;
          } else {
            allQuestions.push({
              question: q.question,
              count: 1,
              ruleId: entry.ruleId,
              correctAnswer: q.correctAnswer,
            });
          }
        } else {
          const existingCorrect = correctQuestions.find(
            (item) => item.question === q.question
          );
          if (existingCorrect) {
            existingCorrect.count++;
          } else {
            correctQuestions.push({
              question: q.question,
              count: 1,
              ruleId: entry.ruleId,
              correctAnswer: q.correctAnswer,
            });
          }
        }

        if (!ruleQuestionMap[entry.ruleId]) {
          ruleQuestionMap[entry.ruleId] = {};
        }
        if (!ruleQuestionMap[entry.ruleId][q.question]) {
          ruleQuestionMap[entry.ruleId][q.question] = {
            count: 0,
            correct: 0,
            correctAnswer: q.correctAnswer,
            selectedAnswers: [],
          };
        }
        ruleQuestionMap[entry.ruleId][q.question].count += 1;
        ruleQuestionMap[entry.ruleId][q.question].correct += q.isCorrect
          ? 1
          : 0;
        ruleQuestionMap[entry.ruleId][q.question].selectedAnswers.push(
          q.selectedAnswer
        );
      });
    });

    const sortedRules = Object.entries(ruleStats).sort((a, b) => b[1] - a[1]);
    setDifficultRules(sortedRules.slice(0, 5));
    setEasiestRules([...sortedRules].reverse().slice(0, 5));

    const sortedDifficultQuestions = allQuestions.sort(
      (a, b) => b.count - a.count
    );
    setTopDifficultQuestions(sortedDifficultQuestions.slice(0, 5));

    const sortedEasiestQuestions = correctQuestions.sort(
      (a, b) => b.count - a.count
    );
    setTopEasiestQuestions(sortedEasiestQuestions.slice(0, 5));
  };

  const analyzeAges = (data) => {
    try {
      const filtered = data
        .map((entry) => ({ ...entry, age: parseInt(entry.age, 10) }))
        .filter(
          (entry) => !isNaN(entry.age) && entry.age >= 7 && entry.age <= 17
        );

      const insightsList = filtered.map((entry) => ({
        id: entry._id,
        text: `Student ${entry.name}, Age: ${entry.age}, Grade: ${entry.grade}, Score: ${entry.score}`,
        title: entry.title,
      }));

      if (filtered.length === 0) {
        setAgeInsights({ insights: [], stats: null });
        return;
      }

      const gradeStats = filtered.reduce((acc, { grade, score }) => {
        if (!acc[grade]) acc[grade] = { total: 0, count: 0 };
        acc[grade].total += score;
        acc[grade].count++;
        return acc;
      }, {});

      const ageStats = filtered.reduce((acc, { age, score }) => {
        if (!acc[age]) acc[age] = { total: 0, count: 0 };
        acc[age].total += score;
        acc[age].count++;
        return acc;
      }, {});

      const averageByGrade = Object.entries(gradeStats).map(
        ([grade, stats]) => ({
          grade: parseInt(grade),
          average: Math.round((stats.total / stats.count) * 10) / 10,
        })
      );

      const averageByAge = Object.entries(ageStats).map(([age, stats]) => ({
        age: parseInt(age),
        average: Math.round((stats.total / stats.count) * 10) / 10,
      }));

      const hardestGrade = [...averageByGrade].sort(
        (a, b) => a.average - b.average
      )[0];
      const easiestGrade = [...averageByGrade].sort(
        (a, b) => b.average - a.average
      )[0];
      const hardestAge = [...averageByAge].sort(
        (a, b) => a.average - b.average
      )[0];
      const easiestAge = [...averageByAge].sort(
        (a, b) => b.average - a.average
      )[0];

      setAgeInsights({
        insights: insightsList,
        stats: {
          totalStudents: filtered.length,
          hardestGrade,
          easiestGrade,
          hardestAge,
          easiestAge,
          averageByGrade,
          averageByAge,
        },
      });
    } catch (error) {
      console.error("Error analyzing age data:", error);
      setAgeInsights({ insights: [], stats: null });
    }
  };

  const prepareChartData = () => {
    const rulePerformance = {};
    results.forEach((entry) => {
      if (entry.ruleId) {
        if (!rulePerformance[entry.ruleId]) {
          rulePerformance[entry.ruleId] = {
            correct: 0,
            total: 0,
            title: entry.title || "Unknown Rule",
          };
        }
        rulePerformance[entry.ruleId].correct += entry.correct;
        rulePerformance[entry.ruleId].total += entry.results.length;
      }
    });

    return Object.entries(rulePerformance).map(([ruleId, data]) => ({
      rule: data.title,
      accuracy:
        data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : 0,
    }));
  };

  const radarData = prepareChartData();
  const lineData = ageInsights.stats?.averageByAge || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top 5 Difficult Rules */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Top 5 Difficult Rules
        </h2>
        <p className="mb-4 dark:text-gray-300">
          These cards list the rules with the highest number of incorrect
          attempts. They help identify the areas where students struggled the
          most.
        </p>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4">
            {difficultRules.map(([ruleId, count], index) => (
              <div
                key={ruleId}
                className="bg-red-50 dark:bg-red-900 p-4 rounded-lg"
              >
                <p className="font-semibold dark:text-white">
                  #{index + 1}:{" "}
                  {results.find((r) => r.ruleId === Number(ruleId))?.title ||
                    "Unknown Rule"}
                </p>
                <p className="dark:text-white">Incorrect Attempts: {count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Easiest Rules */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Top 5 Easiest Rules
        </h2>
        <p className="mb-4 dark:text-gray-300">
          These cards list the rules with the lowest number of incorrect
          attempts. They indicate the areas where students performed well.
        </p>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4">
            {easiestRules.map(([ruleId, count], index) => (
              <div
                key={ruleId}
                className="bg-green-50 dark:bg-green-900 p-4 rounded-lg"
              >
                <p className="font-semibold dark:text-white">
                  #{index + 1}:{" "}
                  {results.find((r) => r.ruleId === Number(ruleId))?.title ||
                    "Unknown Rule"}
                </p>
                <p className="dark:text-white">Incorrect Attempts: {count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Difficult Questions */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Top 5 Difficult Questions
        </h2>
        <p className="mb-4 dark:text-gray-300">
          These cards display the questions that were most frequently answered
          incorrectly.
        </p>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4">
            {topDifficultQuestions.map((q, index) => (
              <div
                key={index}
                className="bg-red-50 dark:bg-red-900 p-4 rounded-lg"
              >
                <p className="font-semibold dark:text-white">
                  #{index + 1}: {q.question}
                </p>
                <p className="dark:text-white">Incorrect Attempts: {q.count}</p>
                <p className="dark:text-white">
                  Correct Answer: {q.correctAnswer}
                </p>
                <p className="text-sm dark:text-gray-300">
                  Rule:{" "}
                  {results.find((r) => r.ruleId === q.ruleId)?.title ||
                    "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top 5 Easiest Questions */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Top 5 Easiest Questions
        </h2>
        <p className="mb-4 dark:text-gray-300">
          These cards display the questions that were most frequently answered
          correctly.
        </p>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4">
            {topEasiestQuestions.map((q, index) => (
              <div
                key={index}
                className="bg-green-50 dark:bg-green-900 p-4 rounded-lg"
              >
                <p className="font-semibold dark:text-white">
                  #{index + 1}: {q.question}
                </p>
                <p className="dark:text-white">Correct Attempts: {q.count}</p>
                <p className="dark:text-white">
                  Correct Answer: {q.correctAnswer}
                </p>
                <p className="text-sm dark:text-gray-300">
                  Rule:{" "}
                  {results.find((r) => r.ruleId === q.ruleId)?.title ||
                    "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rule Accuracy Table */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl col-span-2">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Rule Accuracy
        </h2>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 dark:text-gray-300">
                    Rule
                  </th>
                  <th className="text-right py-3 px-4 dark:text-gray-300">
                    Accuracy
                  </th>
                </tr>
              </thead>
              <tbody>
                {radarData
                  .sort((a, b) => b.accuracy - a.accuracy)
                  .map((rule, index) => (
                    <tr
                      key={index}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-3 px-4 dark:text-gray-300">
                        {rule.rule}
                      </td>
                      <td className="py-3 px-4 text-right dark:text-gray-300">
                        <div className="flex items-center justify-end">
                          <span className="mr-2">{rule.accuracy}%</span>
                          <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded">
                            <div
                              className="h-3 bg-blue-500 rounded"
                              style={{ width: `${rule.accuracy}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rule Performance Trends */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl col-span-2">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Rule Performance Trends
        </h2>
        <p className="mb-4 dark:text-gray-300">
          This line chart shows the average accuracy for each rule. It provides
          insights into how different rules perform overall.
        </p>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={radarData}>
              <XAxis dataKey="rule" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1F2937" : "#FFF",
                  border: isDarkMode
                    ? "1px solid #374151"
                    : "1px solid #E5E7EB",
                }}
                formatter={(value) => [`${value}%`, "Accuracy"]}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke={isDarkMode ? "#C4B5FD" : "#8B5CF6"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Age Performance Trends */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl col-span-2">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Age Performance Trends
        </h2>
        <p className="mb-4 dark:text-gray-300">
          This line chart represents the average score of students grouped by
          age. It helps to visualize performance trends and identify which age
          groups may need extra support.
        </p>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="average"
                stroke={isDarkMode ? "#6EE7B7" : "#10B981"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Age Insights Section */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl col-span-2">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Student Insights (Ages 7-17)
        </h2>
        {ageInsights.insights.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 dark:text-white">
                  Grade Performance
                </h3>
                <p className="dark:text-white">
                  Most Challenging Grade: Grade{" "}
                  {ageInsights.stats.hardestGrade.grade} (Avg Score:{" "}
                  {ageInsights.stats.hardestGrade.average})
                </p>
                <p className="dark:text-white">
                  Most Proficient Grade: Grade{" "}
                  {ageInsights.stats.easiestGrade.grade} (Avg Score:{" "}
                  {ageInsights.stats.easiestGrade.average})
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 dark:text-white">
                  Age Performance
                </h3>
                <p className="dark:text-white">
                  Most Challenging Age: {ageInsights.stats.hardestAge.age} years
                  (Avg Score: {ageInsights.stats.hardestAge.average})
                </p>
                <p className="dark:text-white">
                  Most Proficient Age: {ageInsights.stats.easiestAge.age} years
                  (Avg Score: {ageInsights.stats.easiestAge.average})
                </p>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">
              Individual Student Results
            </h3>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse p-3 bg-gray-100 dark:bg-gray-800 rounded-md h-16"
                  ></div>
                ))}
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ageInsights.insights
                    .slice(0, showAll ? undefined : 10)
                    .map(({ id, text, title }) => (
                      <li
                        key={id}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center"
                      >
                        <div>
                          <span>{text}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Rule: {title}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteResult(id)}
                          className="ml-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                </ul>
                {ageInsights.insights.length > 10 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
            <span className="dark:text-yellow-200">
              ⚠️ No age insights available. This could be because:
              <ul className="list-disc pl-6 mt-2">
                <li>No students in the 7-17 age range</li>
                <li>Age data not properly formatted</li>
                <li>No test results available</li>
              </ul>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;
