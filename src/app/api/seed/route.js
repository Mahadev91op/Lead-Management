// src/app/api/seed/route.js
import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // Dono users ka data
    const usersToCreate = [
      {
        name: "Mahadev Tanti",
        email: "mahadevtanti191@gmail.com",
        passwordPlain: "maha123"
      },
      {
        name: "Nitish Kumar",
        email: "nitishkumartanti1235@gmail.com",
        passwordPlain: "nitish123"
      }
    ];

    const createdUsers = [];
    const skippedUsers = [];

    for (const userData of usersToCreate) {
      // Check karein user pehle se hai ya nahi
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Password encrypt karein
        const hashedPassword = await bcrypt.hash(userData.passwordPlain, 10);
        
        // Naya user banayein
        await User.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        });
        createdUsers.push(userData.email);
      } else {
        skippedUsers.push(userData.email);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Seed Process Completed!",
      created: createdUsers,
      already_existed: skippedUsers
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}