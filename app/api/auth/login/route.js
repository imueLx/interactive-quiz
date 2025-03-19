import { NextResponse } from "next/server";
import Admin from "../../../../models/Admin";
import dbConnect from "../../../../lib/dbConnect";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers"; // For setting cookies properly

export async function POST(request) {
  await dbConnect();
  const { username, pin } = await request.json();

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials - User" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(pin, admin.pin);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials - Pin" },
        { status: 401 }
      );
    }

    // Store session
    const sessionId = crypto.randomUUID();
    const cookieStore = await cookies();
    cookieStore.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
