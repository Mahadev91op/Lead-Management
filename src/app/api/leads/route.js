// app/api/leads/route.js
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";

// 1. लीड्स को प्राप्त करने के लिए (GET Request)
export async function GET() {
  await connectDB();
  const leads = await Lead.find({}).sort({ createdAt: -1 }); // नई लीड सबसे ऊपर
  return NextResponse.json({ success: true, data: leads });
}

// 2. नई लीड बनाने के लिए (POST Request)
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const newLead = await Lead.create(body);
  return NextResponse.json({ success: true, data: newLead }, { status: 201 });
}