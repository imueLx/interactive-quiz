"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QuizIntro from "../../components/QuizIntro";
import QuizQuestion from "../../components/QuizQuestion";
import QuizResults from "../../components/QuizResults";

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

export default function QuizPage() {
  const { rule } = useParams();
  const ruleId = `rule${rule}`;
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizDetails, setQuizDetails] = useState({});

  // Fetch quiz questions when rule changes
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?ruleNumber=${rule}`);
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuizDetails(data);
        setQuestions(data.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (rule) fetchQuizQuestions();
  }, [rule]);

  const handleAnswer = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Retrieve student data from localStorage
      const storedData = localStorage.getItem("studentData");
      const studentData = storedData ? JSON.parse(storedData) : null;

      if (!studentData) {
        console.error("No student data found in localStorage.");
        return;
      }

      // Prepare results by determining incorrect/correct answers
      const results = questions.map((q, index) => {
        const userAnswer = selectedAnswers[index] || null; // Get user's answer
        const isCorrect = userAnswer === q.answer; // Check correctness
        const correctAnswer = isCorrect
          ? userAnswer
          : q.options.find((opt) => opt !== userAnswer); // Infer correct answer

        return {
          question: q.question,
          selectedAnswer: userAnswer,
          correctAnswer,
          isCorrect,
        };
      });

      // Send data to the API
      const payload = {
        ruleId,
        results,
        name: studentData.name,
        age: studentData.age,
        grade: studentData.grade,
      };

      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setQuizCompleted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (quizCompleted)
    return (
      <QuizResults
        selectedAnswers={selectedAnswers}
        questions={questions}
        quizTopics={quizTopics}
        ruleId={ruleId}
      />
    );
  if (currentQuestion === -1)
    return (
      <QuizIntro
        quizDetails={quizDetails}
        ruleId={ruleId}
        quizTopics={quizTopics}
        startQuiz={() => setCurrentQuestion(0)}
      />
    );

  return (
    <QuizQuestion
      question={questions[currentQuestion]}
      quizTopics={quizTopics}
      ruleId={ruleId}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      handleAnswer={handleAnswer}
      handleNext={() => setCurrentQuestion((prev) => prev + 1)}
      handleSubmit={handleSubmit}
      selectedAnswers={selectedAnswers}
    />
  );
}
