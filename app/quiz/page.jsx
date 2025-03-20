"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizIntro from "../components/QuizIntro";
import QuizQuestion from "../components/QuizQuestion";
import QuizResults from "../components/QuizResults";
import {
  getAllQuizzes,
  saveAllQuizzes,
  savePendingSubmission,
  getPendingSubmissions,
  removePendingSubmission,
} from "../../lib/idb";
import Loading from "../components/Loading";
import Error from "./error";

export default function QuizPage() {
  const router = useRouter();

  // We'll load the selected topic _id from localStorage.
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  // Once topics are fetched, we'll identify the chosen topic.
  const [selectedTopic, setSelectedTopic] = useState(null);
  // Dynamic topics loaded from the API.
  const [topics, setTopics] = useState([]);

  // Quiz flow state.
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [quizDetails, setQuizDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Fetch topics from the API.
  useEffect(() => {
    async function loadTopics() {
      // Try to load topics from localStorage first.
      const stored = localStorage.getItem("quizTopics");
      if (stored) {
        setTopics(JSON.parse(stored));
      } else {
        try {
          const res = await fetch("/api/get-title");
          const data = await res.json();
          setTopics(data);
          localStorage.setItem("quizTopics", JSON.stringify(data));
        } catch (err) {
          console.error("Error fetching topics:", err);
        }
      }
    }
    loadTopics();
  }, []);

  // Retrieve the selected topic _id from localStorage.
  useEffect(() => {
    const storedData = localStorage.getItem("studentData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.rule) {
        setSelectedRuleId(parsedData.rule);
      } else {
        router.push("/quizzes");
      }
    } else {
      router.push("/quizzes");
    }
  }, [router]);

  // Once topics and the stored rule are available, find the selected topic.
  useEffect(() => {
    if (topics.length > 0 && selectedRuleId) {
      const topic = topics.find((t) => t.ruleNumber === selectedRuleId);
      if (topic) {
        setSelectedTopic(topic);
      } else {
        router.push("/quizzes");
      }
    }
  }, [topics, selectedRuleId, router]);

  // Navigation handlers.
  const handleBackToSelection = () => router.push("/quizzes");
  const handleNextQuestion = () => setCurrentQuestion((prev) => prev + 1);
  const handlePrevQuestion = () => setCurrentQuestion((prev) => prev - 1);

  // Answer selection.
  const handleAnswer = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  // Submission function.
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const results = questions.map((q, index) => ({
        question: q.question,
        selectedAnswer: selectedAnswers[index] || null,
        isCorrect: selectedAnswers[index] === q.answer,
        correctAnswer: q.answer,
      }));

      setQuizCompleted(true);

      const storedData = localStorage.getItem("studentData");
      const studentData = storedData ? JSON.parse(storedData) : null;

      const payload = {
        ruleId: selectedTopic ? selectedTopic.ruleNumber : null,
        // Added topic details from quizTopics:
        title: selectedTopic ? selectedTopic.title : null,
        description: selectedTopic ? selectedTopic.description : null,
        results,
        studentData,
        timestamp: new Date().toISOString(),
      };

      if (navigator.onLine) {
        await submitResults(payload);
        setSubmissionStatus("submitted");
      } else {
        await savePendingSubmission(payload);
        setSubmissionStatus("pending");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  // API submission helper.
  const submitResults = async (payload) => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Submission failed");
      return true;
    } catch (error) {
      if (navigator.onLine) await savePendingSubmission(payload);
      throw error;
    }
  };

  // Define a shuffle function using Fisher-Yates algorithm
  function shuffleArray(array) {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }

  // Sync pending submissions when online.
  useEffect(() => {
    const syncPendingSubmissions = async () => {
      if (navigator.onLine) {
        try {
          const pending = await getPendingSubmissions();
          for (const submission of pending) {
            try {
              await submitResults(submission);
              await removePendingSubmission(submission.id);
            } catch (error) {
              console.error("Failed to sync submission:", submission.id, error);
            }
          }
        } catch (error) {
          console.error("Sync error:", error);
        }
      }
    };
    window.addEventListener("online", syncPendingSubmissions);
    return () => window.removeEventListener("online", syncPendingSubmissions);
  }, []);

  // Load quiz data when a selected topic is available.
  useEffect(() => {
    async function loadQuizData() {
      if (!selectedTopic) return;
      setLoading(true);
      try {
        const allQuizzes = await getAllQuizzes();
        const parsedRule = parseInt(selectedTopic.ruleNumber);

        const cachedQuiz = allQuizzes.find((q) => q.ruleNumber === parsedRule);
        if (cachedQuiz) {
          setQuizDetails(cachedQuiz);
          setQuestions(cachedQuiz.questions);
        }

        if (navigator.onLine) {
          const response = await fetch(
            `/api/questions?ruleNumber=${parsedRule}`
          );
          if (!response.ok) throw new Error("Failed to fetch");
          const freshData = await response.json();

          // Shuffle the questions array before setting the state
          const shuffledQuestions = shuffleArray(freshData.questions);

          const validatedData = {
            ruleNumber: parsedRule,
            questions: shuffledQuestions,
            topic: freshData.topic || `Rule ${parsedRule}`,
            description: freshData.description || "",
          };

          if (
            !cachedQuiz ||
            JSON.stringify(cachedQuiz) !== JSON.stringify(validatedData)
          ) {
            setQuizDetails(validatedData);
            setQuestions(validatedData.questions);
            await saveAllQuizzes([
              ...allQuizzes.filter((q) => q.ruleNumber !== parsedRule),
              validatedData,
            ]);
          }
        } else if (!cachedQuiz) {
          throw new Error("No cached data for this rule");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (selectedTopic) loadQuizData();
  }, [selectedTopic]);

  if (loading || isSubmitting) return <Loading />;
  if (error) return <Error />;

  return (
    <>
      {quizCompleted ? (
        <QuizResults
          selectedAnswers={selectedAnswers}
          questions={questions}
          quizTopics={topics} // dynamic topics from API
          ruleId={selectedTopic ? selectedTopic.ruleNumber : ""}
          submissionStatus={submissionStatus}
          onReturn={handleBackToSelection}
        />
      ) : currentQuestion === -1 ? (
        <QuizIntro
          quizDetails={quizDetails}
          ruleId={selectedTopic ? selectedTopic.ruleNumber : ""}
          quizTopics={topics}
          startQuiz={() => setCurrentQuestion(0)}
          onReturn={handleBackToSelection}
        />
      ) : (
        <QuizQuestion
          question={questions[currentQuestion]}
          quizTopics={topics}
          ruleId={selectedTopic ? selectedTopic.ruleNumber : ""}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          handleAnswer={handleAnswer}
          handleNext={handleNextQuestion}
          handlePrev={handlePrevQuestion}
          handleSubmit={handleSubmit}
          selectedAnswers={selectedAnswers}
          onReturn={handleBackToSelection}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
