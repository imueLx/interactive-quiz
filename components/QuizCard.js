import Link from "next/link";

export default function QuizCard({ quiz }) {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{quiz.title}</h2>
      <p>{quiz.description}</p>
      <Link href={`/quiz/${quiz._id}`}>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Start Quiz
        </button>
      </Link>
    </div>
  );
}
