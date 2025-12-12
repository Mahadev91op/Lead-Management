// src/app/api/leads/[id]/route.js
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// Helper Function: Check Auth
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;
  try {
    return jwt.verify(token.value, SECRET);
  } catch (e) {
    return null;
  }
}

// 1. DELETE Lead
export async function DELETE(request, { params }) {
  try {
    // FIX: Next.js 16 me params ko await karna zaroori hai
    const { id } = await params;

    // Security Check
    const user = await checkAuth();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();
    
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. UPDATE Lead (PUT)
export async function PUT(request, { params }) {
  try {
    // FIX: Await params here too
    const { id } = await params;

    // Security Check
    const user = await checkAuth();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json(); 
    
    await connectDB();
    const updatedLead = await Lead.findByIdAndUpdate(id, body, { new: true });

    if (!updatedLead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}