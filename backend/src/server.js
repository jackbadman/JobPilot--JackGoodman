import dotenv from "dotenv";
import connectDB from "./config/connectDB.js"; 
import app from "./app.js";

dotenv.config();

// Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
