import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";

export async function GET() {
  await dbConnect();
  const quizzes = await Quiz.find();
  return NextResponse.json(quizzes);
}

// POST - Create new quiz
export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  try {
    // Check if a quiz with the same rule number already exists
    const existingQuiz = await Quiz.findOne({ ruleNumber: body.ruleNumber });
    if (existingQuiz) {
      return new Response(
        JSON.stringify({ success: false, error: "Rule number already exists" }),
        { status: 400 }
      );
    }

    const newQuiz = await Quiz.create(body);
    return new Response(JSON.stringify({ success: true, data: newQuiz }), {
      status: 201,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
