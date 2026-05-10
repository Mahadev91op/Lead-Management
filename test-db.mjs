import mongoose from "mongoose";

const uri = "mongodb+srv://mahadevtanti191_db_user:Maha123@cluster0.omslik6.mongodb.net/devsamp_crm?retryWrites=true&w=majority";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
