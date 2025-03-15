import dbConnect from "../../../lib/dbConnect";
import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({}, { strict: false });
const QuizResult =
  mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);

export async function GET() {
  try {
    await dbConnect();
    const results = await QuizResult.find({}, "name ruleId score")
      .sort({ createdAt: -1 })
      .lean();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
