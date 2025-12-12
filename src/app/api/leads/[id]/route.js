// app/api/leads/[id]/route.js
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";

// 1. लीड डिलीट करने के लिए (DELETE)
export async function DELETE(request, { params }) {
  const { id } = params;
  await connectDB();
  await Lead.findByIdAndDelete(id);
  return NextResponse.json({ success: true, message: "Lead Deleted" });
}

// 2. लीड का स्टेटस अपडेट करने के लिए (PUT)
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json(); // जैसे { status: "Closed" }
  await connectDB();
  const updatedLead = await Lead.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ success: true, data: updatedLead });
}