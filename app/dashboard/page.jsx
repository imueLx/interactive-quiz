"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSave } from "react-icons/fa";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [view, setView] = useState("quizzes");
  const [form, setForm] = useState({
    title: "",
    ruleNumber: "",
    description: "",
    questions: [{ question: "", options: ["", ""], correctAnswer: "" }],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch quizzes
    const quizzesRes = await fetch("/api/all-questions");
    const quizzesData = await quizzesRes.json();
    setQuizzes(quizzesData);

    // Fetch results
    const resultsRes = await fetch("/api/results");
    const resultsData = await resultsRes.json();
    setResults(resultsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingQuiz
      ? `/api/quizzes/${editingQuiz._id}`
      : "/api/quizzes";
    const method = editingQuiz ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setShowQuizModal(false);
        setForm({
          title: "",
          ruleNumber: "",
          description: "",
          questions: [{ question: "", options: ["", ""], correctAnswer: "" }],
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteQuiz = async (id) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", ""], correctAnswer: "" },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    const updated = form.questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setForm((prev) => ({ ...prev, questions: updated }));
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = form.questions.map((q, i) => {
      if (i === qIndex) {
        const options = [...q.options];
        options[oIndex] = value;
        return { ...q, options };
      }
      return q;
    });
    setForm((prev) => ({ ...prev, questions: updated }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`btn ${
            view === "quizzes" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("quizzes")}
        >
          Quizzes
        </button>
        <button
          className={`btn ${
            view === "results" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("results")}
        >
          Results
        </button>
        {view === "quizzes" && (
          <button
            className="btn bg-green-500 text-white"
            onClick={() => setShowQuizModal(true)}
          >
            <FaPlus className="mr-2" /> New Quiz
          </button>
        )}
      </div>

      {view === "quizzes" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Rule #</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td className="px-6 py-4">{quiz.title}</td>
                  <td className="px-6 py-4">{quiz.ruleNumber}</td>
                  <td className="px-6 py-4">{quiz.description}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setEditingQuiz(quiz);
                        setForm(quiz);
                        setShowQuizModal(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteQuiz(quiz._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Age</th>
                <th className="px-6 py-3 text-left">Rule #</th>
                <th className="px-6 py-3 text-left">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="px-6 py-4">{result.name}</td>
                  <td className="px-6 py-4">{result.grade}</td>
                  <td className="px-6 py-4">{result.age}</td>
                  <td className="px-6 py-4">{result.ruleNumber}</td>
                  <td className="px-6 py-4">{result.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showQuizModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingQuiz ? "Edit Quiz" : "Create Quiz"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Rule Number</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={form.ruleNumber}
                      onChange={(e) =>
                        setForm({ ...form, ruleNumber: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Description</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {form.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border p-4 rounded">
                    <div className="mb-4">
                      <label className="block mb-2">
                        Question {qIndex + 1}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(qIndex, "question", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex}>
                          <label className="block mb-2">
                            Option {oIndex + 1}
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={option}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, e.target.value)
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block mb-2">Correct Answer</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(
                            qIndex,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                        required
                      >
                        {question.options.map((_, oIndex) => (
                          <option key={oIndex} value={oIndex}>
                            Option {oIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn bg-gray-200 hover:bg-gray-300"
                  onClick={addQuestion}
                >
                  Add Question
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="btn bg-gray-500 text-white"
                  onClick={() => {
                    setShowQuizModal(false);
                    setEditingQuiz(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-blue-500 text-white">
                  <FaSave className="mr-2" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
