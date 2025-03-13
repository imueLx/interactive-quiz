export async function analyzeQuizResults(quizId) {
  const quiz = await Quiz.findById(quizId)
    .select("questions totalAttempts totalScore")
    .lean();

  const results = await Result.find({ quizId }).select("answers score").lean();

  // Question analysis
  const questionAnalysis = quiz.questions.map((question) => {
    const questionResults = results.flatMap((result) =>
      result.answers.filter((a) => a.questionId.equals(question._id))
    );

    const optionCounts = questionResults.reduce((acc, curr) => {
      acc[curr.selectedAnswer] = (acc[curr.selectedAnswer] || 0) + 1;
      return acc;
    }, {});

    return {
      questionId: question._id,
      questionText: question.text,
      correctAnswer: question.correctAnswer,
      totalAttempts: questionResults.length,
      correctCount: questionResults.filter((a) => a.isCorrect).length,
      optionDistribution: optionCounts,
      difficultyPercentage:
        (questionResults.filter((a) => a.isCorrect).length /
          questionResults.length) *
          100 || 0,
    };
  });

  // Sort questions by difficulty
  const sortedQuestions = [...questionAnalysis].sort(
    (a, b) => a.difficultyPercentage - b.difficultyPercentage
  );

  return {
    totalAttempts: quiz.totalAttempts,
    averageScore: quiz.totalScore / quiz.totalAttempts || 0,
    hardestQuestions: sortedQuestions.slice(0, 3),
    easiestQuestions: sortedQuestions.slice(-3).reverse(),
    questionAnalysis,
  };
}
