import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { airesponse } from "./controller/aicontroller.js"; 
import cron from "node-cron";
import { uploadToPinecone } from "./vector.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // 👈 env based frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// ✅ Health check route (important for Render & debugging)
app.get("/", (req, res) => {
  res.send("✅ Backend is running fine!");
});

// ✅ Run immediately on start (with error handling)
uploadToPinecone()
  .then(() => console.log("📂 Initial Pinecone upload completed ✅"))
  .catch(err => console.error("❌ Initial Pinecone upload failed:", err.message));

// ✅ Schedule weekly job (Sunday at midnight)
cron.schedule("0 0 * * 0", async () => {
  console.log(`[${new Date().toISOString()}] ⏰ Weekly Pinecone update started...`);
  try {
    await uploadToPinecone();
    console.log("✅ Weekly Pinecone update done successfully!");
  } catch (err) {
    console.error("❌ Weekly Pinecone update failed:", err.message);
  }
});

// ✅ Routes
app.post("/api/ask", airesponse);

// ✅ Error handling middleware (for unexpected issues)
app.use((err, req, res, next) => {
  console.error("Backend error:", err);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// ✅ Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
