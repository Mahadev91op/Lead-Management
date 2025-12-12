import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

export async function POST(request) {
  await connectDB();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token.value, SECRET);
  } catch(e) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }

  const { newPassword } = await request.json();
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

  return NextResponse.json({ success: true, message: "Password updated" });
}