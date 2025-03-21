"use client";
import { useState, useEffect } from "react";
import { FaChartBar, FaList } from "react-icons/fa";
import ResultsDashboard from "./results/page";
import QuizzesPage from "./quizzes/page";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("quizzes");

  return (
    <div className="p-6 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm md:text-base ${
              activeTab === "quizzes"
                ? "bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("quizzes")}
          >
            <FaList /> Quizzes
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm md:text-base ${
              activeTab === "results"
                ? "bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => setActiveTab("results")}
          >
            <FaChartBar /> Results
          </button>
        </div>

        {/* Quizzes Management */}
        {activeTab === "quizzes" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <QuizzesPage />
          </div>
        )}

        {/* Results Visualization */}
        {activeTab === "results" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 dark:text-gray-100">
              Results Analysis
            </h2>
            <div className="overflow-x-auto">
              <ResultsDashboard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
