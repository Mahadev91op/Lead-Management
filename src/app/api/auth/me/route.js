import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded = jwt.verify(token.value, SECRET);
    return NextResponse.json({ user: decoded });
  } catch (e) {
    return NextResponse.json({ user: null });
  }
}