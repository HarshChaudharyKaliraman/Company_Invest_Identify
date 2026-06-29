// ============================================
// NODES FILE
// In LangGraph, each "node" is ONE STEP in our research
// Think of it like different departments in a company:
//   - Department 1: Find company overview
//   - Department 2: Find financial info + stock exchange listing
//   - Department 3: Find recent news
//   - Department 4: Find competitors
//   - Department 5: Find company fundamentals (PE, Market Cap, etc.)
//   - Department 6: Make the final INVEST or PASS decision
// ============================================

import dotenv from "dotenv";
import Groq from "groq-sdk";
import { searchWeb } from "./tools.js";

// Load .env file FIRST so API keys are available
dotenv.config();

// ─────────────────────────────────────────
// AI SETUP: Groq (Primary) + Gemini (Fallback)
//
// How it works:
//   1. Try Groq first (it's free and fast)
//   2. If Groq fails → automatically switch to Gemini
//   3. If both fail → return an error message
// ─────────────────────────────────────────

// Setup Groq client (Primary AI — Llama 3 model)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Ask Groq AI and get a text answer
async function askGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
}

// Ask Gemini AI using direct REST API (no extra npm package needed!)
// We use Node's built-in fetch to call Google's API directly
async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error(error.error?.message || "Gemini API request failed");
  }

  const data = await response.json();

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from Gemini."
  );
}

// Smart AI caller — tries Groq first, falls back to Gemini if needed
async function askAI(prompt) {
  // ── Try Groq first ──
  try {
    console.log("🤖 Calling Groq (Llama 3)...");
    const result = await askGroq(prompt);
    console.log("✅ Groq responded successfully");
    return result;
  } catch (groqError) {
    console.warn("⚠️  Groq failed:", groqError.message);
    console.log("🔄 Switching to Gemini fallback...");
  }

  // ── Groq failed → try Gemini ──
  try {
    const result = await askGemini(prompt);
    console.log("✅ Gemini responded successfully");
    return result;
  } catch (geminiError) {
    console.error("❌ Gemini also failed:", geminiError.message);
    // Both AIs failed — throw so the caller can handle it
    throw new Error("Both Groq and Gemini are unavailable. Please check your API keys.");
  }
}

// ─────────────────────────────────────────
// NODE 1: Get Company Overview
// Searches: "What is [company]? What do they do?"
// ─────────────────────────────────────────
export async function searchOverviewNode(state) {
  console.log(`🔍 Step 1: Searching overview for "${state.companyName}"...`);

  const query = `${state.companyName} company overview business model what do they do founded headquarters`;
  const result = await searchWeb(query);

  return {
    ...state,
    overview: result,
    steps: [
      ...(state.steps || []),
      { id: 1, label: "Company Overview", status: "done", data: result.substring(0, 300) },
    ],
  };
}

// ─────────────────────────────────────────
// NODE 2: Get Financial Info + Stock Exchange
// Searches: revenue, profit, which stock exchange it is listed on
// ─────────────────────────────────────────
export async function searchFinancialsNode(state) {
  console.log(`💰 Step 2: Searching financials for "${state.companyName}"...`);

  // Search 1: Financial results
  const finQuery = `${state.companyName} revenue profit growth financial results 2024 2025 market cap`;
  const finResult = await searchWeb(finQuery);

  // Search 2: Stock exchange listing (NSE, BSE, NASDAQ, NYSE, etc.)
  const exchangeQuery = `${state.companyName} stock ticker symbol listed exchange NYSE NASDAQ NSE BSE`;
  const exchangeResult = await searchWeb(exchangeQuery);

  return {
    ...state,
    financials: finResult,
    exchangeInfo: exchangeResult,  // Save exchange data separately
    steps: [
      ...state.steps,
      { id: 2, label: "Financial Health & Exchange", status: "done", data: finResult.substring(0, 300) },
    ],
  };
}

// ─────────────────────────────────────────
// NODE 3: Get Recent News
// Searches: Is the news positive or negative?
// ─────────────────────────────────────────
export async function searchNewsNode(state) {
  console.log(`📰 Step 3: Searching news for "${state.companyName}"...`);

  const query = `${state.companyName} latest news 2025 risks opportunities challenges`;
  const result = await searchWeb(query);

  return {
    ...state,
    news: result,
    steps: [
      ...state.steps,
      { id: 3, label: "Recent News", status: "done", data: result.substring(0, 300) },
    ],
  };
}

// ─────────────────────────────────────────
// NODE 4: Get Competitor Info
// Searches: How strong is this company vs others?
// ─────────────────────────────────────────
export async function searchCompetitorsNode(state) {
  console.log(`⚔️  Step 4: Searching competitors for "${state.companyName}"...`);

  const query = `${state.companyName} competitors market share industry position leadership`;
  const result = await searchWeb(query);

  return {
    ...state,
    competitors: result,
    steps: [
      ...state.steps,
      { id: 4, label: "Market & Competitors", status: "done", data: result.substring(0, 300) },
    ],
  };
}

// ─────────────────────────────────────────
// NODE 5: Get Company Fundamentals
// Searches: PE ratio, EPS, market cap, employees, sector
// ─────────────────────────────────────────
export async function searchFundamentalsNode(state) {
  console.log(`📈 Step 5: Searching fundamentals for "${state.companyName}"...`);

  const query = `${state.companyName} PE ratio EPS market capitalization employees sector industry 2024 2025`;
  const result = await searchWeb(query);

  return {
    ...state,
    fundamentals: result,
    steps: [
      ...state.steps,
      { id: 5, label: "Company Fundamentals", status: "done", data: result.substring(0, 300) },
    ],
  };
}

// ─────────────────────────────────────────
// NODE 6: Final Decision
// Groq (Llama 3) reads ALL the research and decides:
// Should we INVEST or PASS?
// Also extracts company profile (exchange, fundamentals, etc.)
// ─────────────────────────────────────────
export async function analyzeAndDecideNode(state) {
  console.log(`🧠 Step 6: Making investment decision for "${state.companyName}"...`);

  // This is the instruction we give to Groq/Llama
  // We paste ALL the research and ask it to analyze + extract key data
  const prompt = `You are an expert investment analyst and financial researcher.

Based on the research below, do two things:
1. Decide if someone should INVEST in ${state.companyName} or PASS
2. Extract the company profile information (exchange, fundamentals, etc.)

=== COMPANY OVERVIEW ===
${state.overview}

=== FINANCIAL HEALTH ===
${state.financials}

=== EXCHANGE & STOCK LISTING ===
${state.exchangeInfo}

=== FUNDAMENTALS ===
${state.fundamentals}

=== RECENT NEWS ===
${state.news}

=== MARKET & COMPETITORS ===
${state.competitors}

=== YOUR TASK ===
Respond ONLY with this exact JSON. No text before or after. No markdown. Just raw JSON:

{"verdict":"INVEST","confidence":75,"summary":"One sentence explaining the decision in simple language","reasons_to_invest":["Positive reason 1","Positive reason 2","Positive reason 3"],"reasons_to_pass":["Risk 1","Risk 2","Risk 3"],"financial_score":7,"news_sentiment":"Positive","market_position":"Strong","full_analysis":"3-4 sentences of reasoning in simple clear language a student can understand","profile":{"exchange":"NASDAQ","ticker":"AAPL","sector":"Technology","founded":"1976","headquarters":"Cupertino, California, USA","employees":"~161,000","market_cap":"~$3.5 Trillion","revenue":"~$383 Billion","pe_ratio":"~29","eps":"~$6.42","description":"One sentence describing what the company does"}}

Rules:
- verdict must be exactly INVEST or PASS
- confidence is a number 0 to 100
- financial_score is a number 0 to 10
- news_sentiment must be exactly Positive, Neutral, or Negative
- market_position must be exactly Strong, Moderate, or Weak
- exchange: put the stock exchange name (e.g. NASDAQ, NYSE, NSE, BSE, TSX) or "Not Publicly Listed" if private
- ticker: the stock symbol (e.g. AAPL, RELIANCE.NS) or "N/A" if not listed
- For unknown values use "N/A"
- Respond with ONLY the JSON, nothing else`;

  const rawText = await askAI(prompt);
  console.log("🤖 AI raw response (first 300 chars):", rawText.substring(0, 300));

  // Try to parse Groq's response as JSON
  let analysis;
  try {
    // Remove any markdown formatting the model might have added
    const cleaned = rawText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extract just the JSON object part (in case model adds text around it)
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : cleaned;

    analysis = JSON.parse(jsonStr);
    console.log("✅ JSON parsed successfully! Verdict:", analysis.verdict);
  } catch (e) {
    // If JSON parsing fails, create a safe fallback response
    console.error("⚠️ Could not parse Groq response as JSON.");
    console.error("Raw response was:", rawText.substring(0, 500));
    analysis = {
      verdict: "PASS",
      confidence: 50,
      summary: "Could not fully analyze the company. Please try again.",
      reasons_to_invest: ["Data was retrieved but analysis failed"],
      reasons_to_pass: ["AI response format error — try again"],
      financial_score: 5,
      news_sentiment: "Neutral",
      market_position: "Moderate",
      full_analysis: "The agent collected data but encountered an issue generating the final analysis. Please try running the research again.",
      profile: {
        exchange: "N/A", ticker: "N/A", sector: "N/A",
        founded: "N/A", headquarters: "N/A", employees: "N/A",
        market_cap: "N/A", revenue: "N/A", pe_ratio: "N/A",
        eps: "N/A", description: "Analysis failed — please try again."
      }
    };
  }

  return {
    ...state,
    verdict: analysis.verdict,
    confidence: analysis.confidence,
    analysis: analysis,
    steps: [
      ...state.steps,
      { id: 6, label: "AI Decision", status: "done", data: analysis.summary },
    ],
  };
}
