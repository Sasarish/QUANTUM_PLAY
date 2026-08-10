import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";

//env file
dotenv.config({ path: "backend/config/config.env" });
const PORT = process.env.PORT || 3000;

//connecting to Mongo DB
connectDB();

// Cloudinary image Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Error handling
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Server is shutting down, due to uncaught Exception`);

  process.exit(1);
});

//running port
const server = app.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});

//Error handling
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Server is shutting down, due to unhandled rejection`);

  server.close(() => {
    process.exit(1);
  });
});