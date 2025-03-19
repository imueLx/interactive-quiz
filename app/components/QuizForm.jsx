"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function QuizForm({ initialData, mode }) {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      ruleNumber: "",
      title: "",
      description: "",
      questions: [{ question: "", options: ["", ""], answer: "" }],
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dark mode classes
  const inputClasses =
    "w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500";
  const sectionClasses =
    "bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700";
  const buttonClasses =
    "flex items-center justify-center px-4 py-2 rounded transition-colors";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: "", options: ["", ""], answer: "" },
      ],
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const addOption = (qIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options.push("");
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, i) => i !== oIndex
    );
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = initialData
        ? `/api/quizzes/${initialData._id}`
        : "/api/quizzes";
      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save quiz");
      }

      router.push("/dashboard/");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="fixed top-[65px] left-0 right-0 bg-gray-50 dark:bg-gray-900 z-40 py-4 shadow-md px-6">
        <div className="flex justify-between items-center mb-4">
          <Link
            href="/dashboard/"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            <FaArrowLeft className="mr-2" /> Back
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            form="quiz-form"
            className={`${buttonClasses} bg-green-600 hover:bg-green-700 dark:bg-green-800 text-white ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaSave className="mr-2" />
            {isSubmitting ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </div>

      <form id="quiz-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Quiz Metadata */}
          <div className="space-y-4">
            {mode === "editing" && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  <span className="text-blue-600 dark:text-blue-400">
                    Edit Quiz:
                  </span>{" "}
                  {formData.title}
                </h2>
              </div>
            )}
            {mode === "new" && (
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Create New Quiz</h2>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Rule Number
              </label>
              <input
                type="number"
                name="ruleNumber"
                value={formData.ruleNumber}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${inputClasses} resize-y min-h-[100px]`}
                required
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <div className="sticky top-[150px] z-30 bg-gray-50 dark:bg-gray-900 py-3 shadow-md px-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className={`${buttonClasses} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 flex items-center gap-2`}
              >
                <FaPlus /> Add New Question
              </button>
            </div>

            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className={sectionClasses}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Question {qIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrash className="text-sm" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Question Text
                    </label>
                    <input
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "question", e.target.value)
                      }
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium">
                        Options
                      </label>
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        + Add Option
                      </button>
                    </div>

                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          className={`${inputClasses} flex-1`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-red-500 hover:text-red-700 p-2 rounded"
                          disabled={question.options.length <= 2}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Correct Answer */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Correct Answer
                    </label>
                    <select
                      value={question.answer}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "answer", e.target.value)
                      }
                      className={inputClasses}
                      required
                    >
                      <option value="">Select correct answer</option>
                      {question.options.map((option, oIndex) => (
                        <option key={oIndex} value={option}>
                          Option {oIndex + 1} - {option || "[Empty]"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
