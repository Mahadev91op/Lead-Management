// models/Lead.js
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  status: {
    type: String,
    enum: ["New", "Contacted", "Meeting Fixed", "Closed"],
    default: "New",
  },
  createdAt: { type: Date, default: Date.now },
});

// अगर मॉडल पहले से है तो उसे यूज़ करो, नहीं तो नया बनाओ
export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);