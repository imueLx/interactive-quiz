import dbConnect from "../../../lib/dbConnect";
import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({}, { strict: false });
const QuizResult =
  mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);

export async function POST(req) {
  try {
    const body = await req.json(); // Parse request body
    const { ruleId, results, name, age, grade } = body;

    if (!ruleId || !results || !name || !age || !grade) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Calculate score based on correct answers
    const correctCount = results.filter((q) => q.isCorrect).length;
    const score = (correctCount / results.length) * 100;

    await dbConnect();
    await QuizResult.create({
      name,
      age,
      grade,
      ruleId,
      score,
      results,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Quiz results submitted successfully",
        score,
        results,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting quiz results:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
