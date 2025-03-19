import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbConnect";

export async function POST(request) {
  try {
    await dbConnect(); // Ensure DB connection

    const response = NextResponse.redirect(new URL("/login", request.url)); // Absolute URL fix
    response.cookies.delete("session"); // Remove session cookie immediately

    const session = request.cookies.get("session")?.value;

    if (session) {
      const sessionsCollection = mongoose.connection.db.collection("sessions");

      if (mongoose.Types.ObjectId.isValid(session)) {
        await sessionsCollection.deleteOne({
          _id: new mongoose.Types.ObjectId(session),
        });
      } else {
        await sessionsCollection.deleteOne({ session });
      }
    }

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
