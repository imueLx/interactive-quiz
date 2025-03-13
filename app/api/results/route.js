import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Quiz from "../../../models/Quiz";
import Result from "../../../models/Result";

// GET all results
export async function GET() {
  try {
    await dbConnect();

    const results = await Result.find()
      .select("-__v")
      .populate("quizId", "title")
      .lean();

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// SUBMIT new result
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation
    if (!body.quizId || !body.answers) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the quiz
    const quiz = await Quiz.findById(body.quizId);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Calculate score and prepare answers
    let score = 0;
    const processedAnswers = body.answers
      .map((answer) => {
        const question = quiz.questions.id(answer.questionId);
        if (!question) return null;

        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) score += question.points;

        return {
          questionId: answer.questionId,
          questionText: question.text,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          pointsEarned: isCorrect ? question.points : 0,
        };
      })
      .filter(Boolean);

    // Create result
    const newResult = await Result.create({
      quizId: body.quizId,
      userId: body.userId,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      maxScore: quiz.questions.reduce((sum, q) => sum + q.points, 0),
    });

    // Update quiz statistics
    await Quiz.findByIdAndUpdate(body.quizId, {
      $inc: {
        totalAttempts: 1,
        totalScore: score,
        "questions.$[].stats.totalAttempts": 1,
      },
    });

    // Update question statistics
    for (const answer of processedAnswers) {
      await Quiz.updateOne(
        {
          _id: body.quizId,
          "questions._id": answer.questionId,
        },
        {
          $inc: {
            "questions.$.stats.correctCount": answer.isCorrect ? 1 : 0,
            [`questions.$.stats.optionCounts.${answer.selectedAnswer}`]: 1,
          },
        }
      );
    }

    return NextResponse.json(
      { success: true, data: newResult },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a result
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get("id");

    if (!resultId) {
      return NextResponse.json(
        { success: false, error: "Missing result ID" },
        { status: 400 }
      );
    }

    const deletedResult = await Result.findByIdAndDelete(resultId);
    if (!deletedResult) {
      return NextResponse.json(
        { success: false, error: "Result not found" },
        { status: 404 }
      );
    }

    // Update quiz statistics
    await Quiz.findByIdAndUpdate(deletedResult.quizId, {
      $inc: {
        totalAttempts: -1,
        totalScore: -deletedResult.score,
      },
    });

    // Update question statistics
    for (const answer of deletedResult.answers) {
      await Quiz.updateOne(
        {
          _id: deletedResult.quizId,
          "questions._id": answer.questionId,
        },
        {
          $inc: {
            "questions.$.stats.correctCount": answer.isCorrect ? -1 : 0,
            [`questions.$.stats.optionCounts.${answer.selectedAnswer}`]: -1,
            "questions.$.stats.totalAttempts": -1,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
