import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  
  service: { type: String, default: "Web Development" },
  budget: { type: String, default: "" },
  source: { type: String, default: "Direct" },
  notes: { type: String, default: "" },
  socialLink: { type: String, default: "" },
  addedBy: { type: String, default: "Admin" },

  priority: { 
    type: String, 
    enum: ["High", "Medium", "Low"], 
    default: "Medium" 
  },
  followUpDate: { type: Date },

  status: {
    type: String,
    enum: ["New", "Contacted", "Meeting Fixed", "Closed"],
    default: "New",
  },
  
  // --- New History Field ---
  history: [
    {
      msg: String, // e.g., "Status changed to Closed"
      by: String,  // e.g., "Nitish"
      date: { type: Date, default: Date.now }
    }
  ],
  // -----------------------

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);