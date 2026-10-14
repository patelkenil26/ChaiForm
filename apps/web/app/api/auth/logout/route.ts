import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Explicitly delete and set expired cookies for authentication-token
  cookieStore.delete("authentication-token");
  cookieStore.set("authentication-token", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
  });

  return NextResponse.json({
    success: true,
    message: "Logged out successfully from session",
  });
}
