import mongoose from "mongoose";

/**
 * Connect to MongoDB using MONGO_URI from environment variables.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("MongoDB Atlas connected");
    console.log("Connected to DB:", mongoose.connection.db.databaseName);
    
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};


export default connectDB;
