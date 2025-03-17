"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuizIntro from "./QuizIntro";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import {
  getAllQuizzes,
  saveAllQuizzes,
  savePendingSubmission,
  getPendingSubmissions,
  removePendingSubmission,
} from "../../lib/idb";
import { dataSync } from "@/lib/dataSync";
import Loading from "./Loading";

const quizTopics = [
  { id: "rule1", name: "Subjects & Verbs Must Agree", color: "bg-blue-500" },
  {
    id: "rule2",
    name: "Words Between Subject & Verb",
    color: "bg-green-500",
  },
  { id: "rule3", name: "Prepositional Phrases", color: "bg-purple-500" },
  { id: "rule4", name: "'There' & 'Here' Sentences", color: "bg-yellow-500" },
  {
    id: "rule5",
    name: "Questions & Subject Placement",
    color: "bg-pink-500",
  },
  { id: "rule6", name: "Compound Subjects ('and')", color: "bg-red-500" },
  {
    id: "rule7",
    name: "Same Entity Compound Subjects",
    color: "bg-teal-500",
  },
  {
    id: "rule8",
    name: "Each, Every, No - Singular Rule",
    color: "bg-orange-500",
  },
  {
    id: "rule9",
    name: "Singular Subjects with 'Or'/'Nor'",
    color: "bg-indigo-500",
  },
  {
    id: "rule10",
    name: "Prepositional Phrases & Quantifiers",
    color: "bg-lime-500",
  },
  { id: "rule11", name: "Units of Measurement", color: "bg-cyan-500" },
  {
    id: "rule12",
    name: "Plural Subjects with 'Or'/'Nor'",
    color: "bg-rose-500",
  },
  {
    id: "rule13",
    name: "Mixed Subjects with 'Or'/'Nor'",
    color: "bg-fuchsia-500",
  },
  { id: "rule14", name: "Indefinite Pronouns", color: "bg-violet-500" },
  {
    id: "rule15",
    name: "Plural Pronouns: Few, Many, Several",
    color: "bg-emerald-500",
  },
  {
    id: "rule16",
    name: "Two Infinitives Joined by 'And'",
    color: "bg-blue-400",
  },
  { id: "rule17", name: "Gerunds as Subjects", color: "bg-green-400" },
  { id: "rule18", name: "Collective Nouns", color: "bg-purple-400" },
  {
    id: "rule19",
    name: "Titles of Books, Movies, & Novels",
    color: "bg-yellow-400",
  },
  {
    id: "rule20",
    name: "Only the Subject Affects the Verb",
    color: "bg-pink-400",
  },
];
export default function QuizFlow({ rule }) {
  const router = useRouter();
  const ruleId = `rule${rule}`;
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]); // Moved state here
  const [quizDetails, setQuizDetails] = useState({}); // Moved state here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Add this useEffect for URL validation
  useEffect(() => {
    // Validate rule parameter
    if (!rule || isNaN(rule) || rule < 1 || rule > 20) {
      router.push("/quiz");
      return;
    }
  }, [rule, router]);

  // Navigation handlers
  const handleBackToSelection = () => router.push("/quiz");
  const handleNextQuestion = () => setCurrentQuestion((prev) => prev + 1);
  const handlePrevQuestion = () => setCurrentQuestion((prev) => prev - 1);

  // Answer selection handler
  const handleAnswer = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  // Quiz submission handler

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Calculate results FIRST
      const results = questions.map((q, index) => ({
        question: q.question,
        selectedAnswer: selectedAnswers[index] || null,
        isCorrect: selectedAnswers[index] === q.answer,
        correctAnswer: q.answer,
      }));

      // Immediately show results
      setQuizCompleted(true);

      // Then handle submission
      const storedData = localStorage.getItem("studentData");
      const studentData = storedData ? JSON.parse(storedData) : null;

      const payload = {
        ruleId,
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

  // API submission function
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

  // Data synchronization effect
  useEffect(() => {
    const syncPendingSubmissions = async () => {
      if (navigator.onLine) {
        try {
          const pending = await getPendingSubmissions();
          for (const submission of pending) {
            try {
              await submitResults(submission);
              await removePendingSubmission(submission.id); // Now using correct ID
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

  useEffect(() => {
    const loadQuizData = async () => {
      setLoading(true);
      try {
        const allQuizzes = await getAllQuizzes();
        const parsedRule = parseInt(rule);

        // Find cached quiz data
        const cachedQuiz = allQuizzes.find((q) => q.ruleNumber === parsedRule);

        if (cachedQuiz) {
          setQuizDetails(cachedQuiz);
          setQuestions(cachedQuiz.questions);
        }

        // Only fetch fresh data if online
        if (navigator.onLine) {
          const response = await fetch(
            `/api/questions?ruleNumber=${parsedRule}`
          );
          if (!response.ok) throw new Error("Failed to fetch");

          const freshData = await response.json();
          const validatedData = {
            ruleNumber: parsedRule,
            questions: freshData.questions,
            topic: freshData.topic || `Rule ${parsedRule}`,
            description: freshData.description || "",
          };

          // Update if different
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
    };

    if (rule) loadQuizData();
  }, [rule]);

  // Keep all your existing handlers (handleAnswer, handleSubmit, etc)
  // Add the back button to your QuizQuestion component
  // Update all router.push calls to use query parameters

  if (loading || isSubmitting) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {quizCompleted ? (
        <QuizResults
          selectedAnswers={selectedAnswers}
          questions={questions}
          quizTopics={quizTopics}
          ruleId={ruleId}
          submissionStatus={submissionStatus}
          onReturn={handleBackToSelection}
        />
      ) : currentQuestion === -1 ? (
        <QuizIntro
          quizDetails={quizDetails}
          ruleId={ruleId}
          quizTopics={quizTopics}
          startQuiz={() => setCurrentQuestion(0)}
          onReturn={handleBackToSelection}
        />
      ) : (
        <QuizQuestion
          question={questions[currentQuestion]}
          quizTopics={quizTopics}
          ruleId={ruleId}
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
