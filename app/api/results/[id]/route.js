import dbConnect from "../../../../lib/dbConnect";
import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({}, { strict: false });
const QuizResult =
  mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);

export async function DELETE(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    console.log("Deleting quiz result with id:", id);
    await QuizResult.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Quiz result deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting quiz result:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
