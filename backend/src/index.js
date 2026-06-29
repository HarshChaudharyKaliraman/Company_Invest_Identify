// ============================================
// This is the MAIN SERVER file
// Think of it like the "reception desk" of our app
// When the frontend sends a request, this file receives it
// and passes it to the right place
// ============================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchRouter from "./routes/research.js";

// Load our secret API keys from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow any frontend origin to talk to this server (required for Vercel deployment)
app.use(cors());

// Allow the server to read JSON data sent from the frontend
app.use(express.json());

// All research-related requests go to the research router
// Example: POST /api/research will be handled by research.js
app.use("/api", researchRouter);

// Simple health check — visit the root URL to see if server is running
app.get("/", (req, res) => {
  res.json({ message: "AI Investment Agent Backend is running! 🚀" });
});

// ============================================
// IMPORTANT FOR VERCEL:
// Vercel is "serverless" — it doesn't keep a server running 24/7.
// Instead, it calls this file like a function for each request.
// So we EXPORT the app here (for Vercel), and only call app.listen()
// when running locally on your own computer.
// ============================================
export default app;

// Only start the server when running locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
}
