// models/Lead.js
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  
  // --- New Fields ---
  service: { type: String, default: "Web Development" }, // क्या बनवाना है?
  budget: { type: String, default: "" },                 // कितना पैसा?
  source: { type: String, default: "Direct" },           // कहाँ से आया?
  notes: { type: String, default: "" },                  // एक्स्ट्रा बात
  // ------------------

  status: {
    type: String,
    enum: ["New", "Contacted", "Meeting Fixed", "Closed"],
    default: "New",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);