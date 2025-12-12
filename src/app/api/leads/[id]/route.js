// ... imports same as before ...
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

// Helper same as before...
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

// DELETE same as before...
export async function DELETE(request, { params }) {
    // ... same code ...
    const { id } = await params; // Fix for Next 15/16
    await connectDB();
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Lead Deleted" });
}

// UPDATE Lead (PUT) - MODIFIED FOR HISTORY
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const user = await checkAuth();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json(); 
    await connectDB();

    // History message create karein
    let historyMsg = "Updated lead details";
    if (body.status) historyMsg = `Status changed to ${body.status}`;
    if (body.notes) historyMsg = `Added note: "${body.notes.substring(0, 20)}..."`;

    const updatedLead = await Lead.findByIdAndUpdate(
      id, 
      { 
        $set: body,
        $push: { 
          history: { msg: historyMsg, by: user.name, date: new Date() } 
        }
      }, 
      { new: true }
    );

    if (!updatedLead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}