// app/quiz/page.jsx
import { Suspense } from "react";
import QuizSelectionForm from "../components/QuizSelection";
import QuizFlow from "../components/QuizFlow";
import Loading from "./loading";

export default async function QuizPage({ searchParams }) {
  const params = await searchParams;

  return (
    <div className="quiz-container">
      <Suspense fallback={<Loading />}>
        {!params?.rule ? (
          <QuizSelectionForm />
        ) : (
          <QuizFlow rule={params.rule} />
        )}
      </Suspense>
    </div>
  );
}
