"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus, FaEye, FaCheck } from "react-icons/fa";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleDelete = async () => {
    if (!quizToDelete.id) return;
    try {
      const response = await fetch(`/api/quizzes/${quizToDelete.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete.id));
        setShowModal(false);
        setQuizToDelete(null);
      } else {
        console.error("Failed to delete quiz.");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Manage Quizzes</h2>
        <Link
          href="/dashboard/quizzes/new"
          className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white px-3 sm:px-4 py-2 rounded shadow"
        >
          <FaPlus className="mr-2" /> Add New Quiz
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-300">
            Fetching quizzes...
          </div>
        ) : (
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Rule #
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Title
                </th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase w-1/3">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Questions
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-200">
                    {quiz.ruleNumber}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-200">
                    {quiz.title}
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-300 max-w-[300px] truncate">
                    {quiz.description}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-200">
                    {quiz.questions?.length > 0 ? (
                      <div className="flex items-center">
                        <span className="mr-1">{quiz.questions.length}</span>
                        <span className="text-sm">questions</span>
                        <FaCheck className="ml-1 text-green-600" />
                      </div>
                    ) : (
                      <span className="text-sm text-red-600">No questions</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex space-x-2 sm:space-x-4">
                      <Link
                        href={`/dashboard/quizzes/edit/${quiz._id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FaEdit />
                      </Link>
                      <Link
                        href={`/dashboard/quizzes/questions/${quiz._id}`}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setQuizToDelete({ id: quiz._id, title: quiz.title });
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    No quizzes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete the quiz: <br />
              <strong className="text-red-600">"{quizToDelete?.title}"</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
