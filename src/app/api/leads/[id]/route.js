import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  // Fix: Next.js 15+ params handling
  const { id } = await params;
  const body = await request.json();
  
  await connectDB();

  try {
    const lead = await Lead.findById(id);
    if (!lead) return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });

    // --- 1. Fix: Initialize history if missing (for old leads) ---
    if (!lead.history) {
        lead.history = [];
    }

    // --- 2. History Logic ---
    // Check if status is actually changing
    if (body.status && body.status !== lead.status) {
        lead.history.push({
            msg: `Status changed from ${lead.status} to ${body.status}`,
            by: body.updatedBy || "Admin", 
            date: new Date()
        });
    }

    if (body.newNote) {
        lead.history.push({
            msg: `Note: ${body.newNote}`,
            by: body.updatedBy || "Admin",
            date: new Date()
        });
        delete body.newNote;
    }

    // --- 3. IMPORTANT FIX: Prevent History Overwrite ---
    // Frontend se jo 'history' array aa raha hai use hata dein, 
    // taaki wo hamare naye push kiye hue item ko replace na kare.
    delete body.history; 
    delete body._id; 

    // Update remaining fields
    Object.assign(lead, body);
    
    await lead.save();

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await connectDB();
  
  try {
    await Lead.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}