// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // .env फाइल में अपना URL डालें

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
  }
};

export default connectDB;