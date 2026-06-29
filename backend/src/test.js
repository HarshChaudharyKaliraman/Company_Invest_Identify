// Quick test script to find exactly what's failing
// Run this with: node src/test.js

import dotenv from "dotenv";
dotenv.config();

console.log("=".repeat(50));
console.log("🔍 TESTING API KEYS & CONNECTIONS");
console.log("=".repeat(50));

// Test 1: Check if API keys are loaded
console.log("\n1️⃣  Checking environment variables...");
console.log("   GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `Found (starts with: ${process.env.GEMINI_API_KEY.substring(0, 8)}...)` : "❌ MISSING");
console.log("   TAVILY_API_KEY:", process.env.TAVILY_API_KEY ? `Found (starts with: ${process.env.TAVILY_API_KEY.substring(0, 12)}...)` : "❌ MISSING");

// Test 2: Test Tavily search
console.log("\n2️⃣  Testing Tavily search...");
try {
  const { tavily } = await import("@tavily/core");
  const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
  const result = await client.search("Apple Inc company overview", { maxResults: 1 });
  console.log("   ✅ Tavily works! Got", result.results?.length, "result(s)");
} catch (e) {
  console.log("   ❌ Tavily failed:", e.message);
}

// Test 3: Test Gemini
console.log("\n3️⃣  Testing Gemini AI...");
try {
  const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  });
  const response = await llm.invoke("Say just the word: WORKING");
  console.log("   ✅ Gemini works! Response:", response.content);
} catch (e) {
  console.log("   ❌ Gemini failed:", e.message);
}

// Test 4: Test LangGraph import
console.log("\n4️⃣  Testing LangGraph...");
try {
  const { StateGraph, END } = await import("@langchain/langgraph");
  console.log("   ✅ LangGraph imported successfully");
  console.log("   StateGraph:", typeof StateGraph);
  console.log("   END:", END);
} catch (e) {
  console.log("   ❌ LangGraph failed:", e.message);
}

console.log("\n" + "=".repeat(50));
console.log("Test complete!");
console.log("=".repeat(50));
