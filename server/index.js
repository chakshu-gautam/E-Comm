import express from "express";
import { connectDB } from "./db.js";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route.js";
import { sellerRouter } from "./routes/seller.route.js";

dotenv.config();

const app = express();

console.log("MONGO_URL:", process.env.MONGO_URL);
connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/seller", sellerRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port", process.env.PORT || 3000);
});
