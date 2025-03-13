import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Quiz from "../../../models/Quiz";

// GET all quizzes
export async function GET() {
  try {
    await dbConnect();
    const quizzes = await Quiz.find().select("-__v").lean(); // .lean() for better performance

    return NextResponse.json({ success: true, data: quizzes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// CREATE new quiz
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.questions) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newQuiz = await Quiz.create(body);
    return NextResponse.json({ success: true, data: newQuiz }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create quiz" },
      { status: 500 }
    );
  }
}

// DELETE quiz by ID
export async function DELETE(request) {
  try {
    await dbConnect();
    const { id } = request.query;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    await quiz.remove();
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
