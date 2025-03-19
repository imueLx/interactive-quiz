import dbConnect from "../../../../lib/dbConnect";
import Quiz from "../../../../models/Quiz";

// GET method to retrieve a quiz
export async function GET(_request, context) {
  await dbConnect();
  const { id } = await context.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return new Response(
        JSON.stringify({ success: false, error: "Quiz not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: quiz }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// PUT method to update a quiz
export async function PUT(_request, context) {
  await dbConnect();
  const { id } = await context.params;
  const body = await _request.json();
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!quiz) {
      return new Response(
        JSON.stringify({ success: false, error: "Quiz not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: quiz }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}

// DELETE method to remove a quiz
export async function DELETE(_request, context) {
  await dbConnect();
  const { id } = await context.params;

  try {
    const result = await Quiz.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Quiz not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
