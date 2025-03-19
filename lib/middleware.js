import { NextResponse } from "next/server";
import { mongoose } from "mongoose";

export async function middleware(request) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = new URL(request.url);

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const sessionData = await mongoose.connection.db
      .collection("sessions")
      .findOne({
        _id: new mongoose.Types.ObjectId(session),
        expiresAt: { $gt: new Date() },
      });

    if (!sessionData) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
