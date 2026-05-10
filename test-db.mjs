import mongoose from "mongoose";

const uri = "mongodb://mahadevtanti191_db_user:Maha123@ac-ggzv2mm-shard-00-00.omslik6.mongodb.net:27017,ac-ggzv2mm-shard-00-01.omslik6.mongodb.net:27017,ac-ggzv2mm-shard-00-02.omslik6.mongodb.net:27017/devsamp_crm?authSource=admin&replicaSet=atlas-rocv15-shard-0&retryWrites=true&w=majority&tls=true";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB via direct URI...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
