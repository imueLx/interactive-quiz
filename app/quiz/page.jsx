// app/quiz/page.jsx (Server Component)
import { Suspense } from "react";
import QuizSelectionForm from "../../components/QuizSelection";
import Loading from "./loading";

export default function QuizPage() {
  return (
    <Suspense fallback={<Loading />}>
      <QuizSelectionForm />
    </Suspense>
  );
}
