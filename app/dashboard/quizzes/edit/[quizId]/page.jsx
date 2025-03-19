"use client";
import { useState, useEffect } from "react";
import QuizForm from "../../../../components/QuizForm";
import { use } from "react";
import Loading from "./loading";

export default function EditQuizPage({ params }) {
  const unwrappedParams = use(params);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`/api/quizzes/${unwrappedParams.quizId}`);
      const { data } = await response.json();
      setInitialData(data);
    };
    fetchQuiz();
  }, [unwrappedParams.quizId]);

  if (!initialData) return <Loading />;

  return <QuizForm initialData={initialData} mode="editing" />;
}
