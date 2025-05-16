import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("❌ MONGODB_URI is not defined in the environment variables");
}

const client = new MongoClient(uri);
let db: Db;

export const connectToDb = async () => {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || "node_assignment");
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error("❌ Database not initialized. Call connectToDb() first.");
  }
  return db;
};
