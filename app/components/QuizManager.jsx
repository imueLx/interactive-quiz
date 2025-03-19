"use client";

import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const QuizManager = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const response = await fetch("/api/quizzes");
    const data = await response.json();
    setQuizzes(data);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
    fetchQuizzes();
  };

  const handleEdit = (quiz) => {
    setEditQuiz(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description);
  };

  const handleSave = async () => {
    const method = editQuiz ? "PUT" : "POST";
    const url = editQuiz ? `/api/quizzes/${editQuiz._id}` : "/api/quizzes";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setEditQuiz(null);
    setTitle("");
    setDescription("");
    fetchQuizzes();
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        {editQuiz ? "Edit Quiz" : "Create New Quiz"}
      </h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded-md mb-2"
      />
      <textarea
        placeholder="Quiz Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full rounded-md mb-2"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white p-2 rounded-md w-full hover:bg-blue-700 transition"
      >
        {editQuiz ? "Update Quiz" : "Submit"}
      </button>

      <h2 className="text-xl font-bold my-4">Manage Quizzes</h2>
      <ul className="divide-y">
        {quizzes.map((quiz) => (
          <li key={quiz._id} className="p-3 flex justify-between items-center">
            <span>{quiz.title}</span>
            <div className="flex gap-2">
              <AiOutlineEdit
                className="text-blue-500 cursor-pointer"
                onClick={() => handleEdit(quiz)}
              />
              <AiOutlineDelete
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(quiz._id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizManager;
