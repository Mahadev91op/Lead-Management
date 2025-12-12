import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Token Generate
  const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET, { expiresIn: "7d" });

  const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
  
  // Secure Cookie Set
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}