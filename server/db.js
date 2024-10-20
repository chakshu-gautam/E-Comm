import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database:", db.connections[0].name);
  } catch (error) {
    console.error("Error connecting to database:", error.message); // Log the specific error message
  }
};

export { connectDB };
