// ============================================
// RESEARCH ROUTE
// This is the "door" the frontend knocks on
// When React sends: POST /api/research { companyName: "Apple" }
// This file receives it, runs the AI agent, and sends back the result
// ============================================

import express from "express";
import { buildResearchGraph } from "../agent/graph.js";

const router = express.Router();

// POST /api/research
// The frontend sends: { "companyName": "Tesla" }
// We respond with: { verdict, confidence, analysis, steps }
router.post("/research", async (req, res) => {
  const { companyName } = req.body;

  // Basic validation — make sure a company name was provided
  if (!companyName || companyName.trim() === "") {
    return res.status(400).json({ error: "Please provide a company name!" });
  }

  console.log(`\n🚀 Starting research for: "${companyName}"`);
  console.log("=".repeat(50));

  try {
    // Build and run the LangGraph agent
    const graph = buildResearchGraph();

    // Run the graph with the company name as starting input
    const result = await graph.invoke({
      companyName: companyName.trim(),
      steps: [],
    });

    console.log(`✅ Research complete! Verdict: ${result.verdict}`);

    // Send the final result back to the frontend
    res.json({
      success: true,
      companyName: result.companyName,
      verdict: result.verdict,
      confidence: result.confidence,
      analysis: result.analysis,
      steps: result.steps,
    });
  } catch (error) {
    console.error("❌ Error during research:", error.message);
    res.status(500).json({
      error: "Something went wrong during research. Please check your API keys and try again.",
      details: error.message,
    });
  }
});

export default router;
