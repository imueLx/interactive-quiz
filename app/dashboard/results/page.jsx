"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const ResultsDashboard = () => {
  const [results, setResults] = useState([]);
  const [difficultRules, setDifficultRules] = useState([]);
  const [easiestRules, setEasiestRules] = useState([]);
  const [mostDifficultQuestion, setMostDifficultQuestion] = useState(null);
  const [ageInsights, setAgeInsights] = useState({ insights: [], stats: null });
  const [ruleQuestionMap, setRuleQuestionMap] = useState({});
  const [selectedRule, setSelectedRule] = useState("");
  const [mostDifficultRule, setMostDifficultRule] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const response = await fetch("/api/detailed-results");
    const data = await response.json();

    const formattedData = data.map((entry) => ({
      name: entry.name,
      age: entry.age,
      grade: entry.grade,
      ruleId: entry.ruleId,
      title: entry.title,
      description: entry.description,
      score: entry.score,
      correct: entry.results.filter((q) => q.isCorrect).length,
      incorrect:
        entry.results.length - entry.results.filter((q) => q.isCorrect).length,
    }));

    console.log(formattedData);

    setResults(formattedData);
    analyzeDifficulties(data);
    analyzeAges(data);
  };

  const analyzeDifficulties = (data) => {
    const ruleStats = {};
    const ruleQuestionMap = {};

    data.forEach((entry) => {
      const ruleId = entry.ruleId;
      entry.results.forEach((q) => {
        if (!q.isCorrect) {
          ruleStats[ruleId] = (ruleStats[ruleId] || 0) + 1;

          if (!ruleQuestionMap[ruleId]) {
            ruleQuestionMap[ruleId] = {};
          }
          const questionText = q.question;
          if (!ruleQuestionMap[ruleId][questionText]) {
            ruleQuestionMap[ruleId][questionText] = {
              count: 0,
              correctAnswer: q.correctAnswer,
              selectedAnswers: [],
            };
          }
          ruleQuestionMap[ruleId][questionText].count += 1;
          ruleQuestionMap[ruleId][questionText].selectedAnswers.push(
            q.selectedAnswer
          );
        }
      });
    });

    const sortedRules = Object.entries(ruleStats).sort((a, b) => b[1] - a[1]);
    setDifficultRules(sortedRules);
    setEasiestRules([...sortedRules].reverse());

    if (sortedRules.length > 0) {
      setMostDifficultRule(sortedRules[0]);
    }

    let hardestQuestion = null;
    Object.entries(ruleQuestionMap).forEach(([ruleId, questions]) => {
      Object.entries(questions).forEach(([question, data]) => {
        if (!hardestQuestion || data.count > hardestQuestion.count) {
          hardestQuestion = {
            question,
            count: data.count,
            ruleId,
          };
        }
      });
    });

    setMostDifficultQuestion(
      hardestQuestion ? [hardestQuestion.question, hardestQuestion.count] : null
    );

    setRuleQuestionMap(ruleQuestionMap);
  };

  const analyzeAges = (data) => {
    const filtered = data.filter((entry) => entry.age >= 7 && entry.age <= 15);
    const insightsList = filtered.map(
      (entry) =>
        `Student ${entry.name}, Age: ${entry.age}, Grade: ${entry.grade}, Score: ${entry.score}`
    );

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

    const averageByGrade = Object.entries(gradeStats).map(([grade, stats]) => ({
      grade: parseInt(grade),
      average: Math.round((stats.total / stats.count) * 10) / 10,
    }));

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
  };

  // Prepare data for Recharts
  const barChartData = difficultRules.map(([ruleId, count]) => {
    const topic = results.find((entry) => entry.ruleId === ruleId);
    return {
      rule: topic ? topic.name : ruleId,
      count,
    };
  });

  const overallCorrect = results.reduce((acc, entry) => acc + entry.correct, 0);
  const overallIncorrect = results.reduce(
    (acc, entry) => acc + entry.incorrect,
    0
  );
  const pieData = [
    { name: "Correct", value: overallCorrect },
    { name: "Incorrect", value: overallIncorrect },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Most Difficult Rule Overall Section */}
      {mostDifficultRule && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Most Difficult Rule (Overall)
          </h2>
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <p className="font-semibold dark:text-white">
              Rule:{" "}
              {results.find((entry) => entry.ruleId === mostDifficultRule[0])
                ?.title || "Unknown Rule"}
            </p>
            <p className="dark:text-white">
              Total Incorrect Attempts: {mostDifficultRule[1]}
            </p>
          </div>
        </div>
      )}

      {/* Rule-Specific Question Analysis Section */}
      <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl col-span-2">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Rule-Specific Question Analysis
        </h2>
        <div className="mb-4">
          <select
            value={selectedRule}
            onChange={(e) => setSelectedRule(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select a Rule</option>
            {Object.keys(ruleQuestionMap).map((ruleId) => (
              <option key={ruleId} value={ruleId}>
                Rule:{" "}
                {results.find((entry) => entry.ruleId === mostDifficultRule[0])
                  ?.title || "Unknown Rule"}
              </option>
            ))}
          </select>
        </div>

        {selectedRule && ruleQuestionMap[selectedRule] && (
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Questions for Rule {selectedRule} (Sorted by Difficulty)
            </h3>
            <div className="space-y-4">
              {Object.entries(ruleQuestionMap[selectedRule])
                .sort((a, b) => b[1].count - a[1].count)
                .map(([question, data], index) => {
                  const answerCounts = data.selectedAnswers.reduce(
                    (acc, answer) => {
                      acc[answer] = (acc[answer] || 0) + 1;
                      return acc;
                    },
                    {}
                  );
                  const sortedAnswers = Object.entries(answerCounts).sort(
                    (a, b) => b[1] - a[1]
                  );

                  return (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="font-medium dark:text-gray-200 mb-2">
                        {question}
                      </p>
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-green-600 dark:text-green-300">
                            ✓ Correct:
                          </span>
                          <span className="font-semibold">
                            {data.correctAnswer}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-red-600 dark:text-red-300">
                            ✕ Incorrect:
                          </span>
                          <span>{data.count} times</span>
                        </div>
                      </div>
                      {sortedAnswers.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Most common wrong answers:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {sortedAnswers.map(([answer, count], idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm"
                              >
                                {answer} ({count})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Most Difficult Question Display */}
      {mostDifficultQuestion && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Most Difficult Question (Overall)
          </h2>
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <p className="font-semibold dark:text-white">
              Question: {mostDifficultQuestion[0]}
            </p>
            <p className="dark:text-white">
              Total Incorrect Attempts: {mostDifficultQuestion[1]}
            </p>
          </div>
        </div>
      )}

      {/* Incorrect Attempts by Rule Bar Chart */}
      {barChartData.length > 0 && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Incorrect Attempts by Rule
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="rule" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Overall Correct vs Incorrect Pie Chart */}
      {(overallCorrect > 0 || overallIncorrect > 0) && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Overall Correct vs Incorrect
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#22C55E" : "#EF4444"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Age and Grade Insights */}
      {ageInsights.insights.length > 0 && ageInsights.stats && (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Student Insights (Ages 7-15)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 dark:text-white">
                Grade Performance
              </h3>
              <p className="dark:text-white">
                Hardest Grade: Grade {ageInsights.stats.hardestGrade.grade}{" "}
                (Avg: {ageInsights.stats.hardestGrade.average})
              </p>
              <p className="dark:text-white">
                Easiest Grade: Grade {ageInsights.stats.easiestGrade.grade}{" "}
                (Avg: {ageInsights.stats.easiestGrade.average})
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 dark:text-white">
                Age Performance
              </h3>
              <p className="dark:text-white">
                Hardest Age: {ageInsights.stats.hardestAge.age} years (Avg:{" "}
                {ageInsights.stats.hardestAge.average})
              </p>
              <p className="dark:text-white">
                Easiest Age: {ageInsights.stats.easiestAge.age} years (Avg:{" "}
                {ageInsights.stats.easiestAge.average})
              </p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Individual Student Results
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ageInsights.insights.map((info, index) => (
              <li
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {info}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;
