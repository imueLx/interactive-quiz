"use client";
import { useRouter } from "next/navigation";
import { FaBookOpen, FaPuzzlePiece, FaCheckCircle } from "react-icons/fa";

const quizTopics = [
  { id: "rule1", name: "Subjects & Verbs Must Agree", color: "bg-blue-500" },
  { id: "rule2", name: "Words Between Subject & Verb", color: "bg-green-500" },
  { id: "rule3", name: "Prepositional Phrases", color: "bg-purple-500" },
  { id: "rule4", name: "'There' & 'Here' Sentences", color: "bg-yellow-500" },
  { id: "rule5", name: "Questions & Subject Placement", color: "bg-pink-500" },
  { id: "rule6", name: "Compound Subjects ('and')", color: "bg-red-500" },
  { id: "rule7", name: "Same Entity Compound Subjects", color: "bg-teal-500" },
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

export default function QuizzesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 py-10 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6">
          🎯 Choose Your Quiz!
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Pick a fun grammar quiz and test your skills!
        </p>
      </div>

      {/* Quiz Topic List */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizTopics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => router.push("/quiz?topic=" + topic.id)}
            className={`${topic.color} p-6 rounded-3xl shadow-lg text-white cursor-pointer transition-all hover:scale-105 hover:shadow-xl flex items-center gap-4`}
          >
            <FaPuzzlePiece className="text-4xl animate-spin-slow" />
            <span className="font-semibold text-lg">{topic.name}</span>
          </div>
        ))}
      </div>

      {/* Button to Go Back */}
      <div className="text-center mt-12">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 cursor-pointer text-white px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
