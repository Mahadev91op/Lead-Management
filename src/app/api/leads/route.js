// src/app/api/leads/route.js
import connectDB from "@/lib/db";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

export async function GET(request) {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All"; // Status Filter
  const sortBy = searchParams.get("sortBy") || "createdAt"; // Sort Field
  const order = searchParams.get("order") === "asc" ? 1 : -1; // Sort Order

  const skip = (page - 1) * limit;

  // Query Build
  const query = {};
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (status !== "All") {
    query.status = status;
  }

  try {
    const leads = await Lead.find(query)
      .sort({ [sortBy]: order }) // Dynamic Sorting
      .skip(skip)
      .limit(limit);
      
    const total = await Lead.countDocuments(query);

    return NextResponse.json({ 
      success: true, 
      data: leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let user;
  try {
    user = jwt.verify(token.value, SECRET);
  } catch(e) {
    return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
  }

  await connectDB();
  const body = await request.json();
  const newLead = await Lead.create({ ...body, addedBy: user.name });
  
  return NextResponse.json({ success: true, data: newLead }, { status: 201 });
}