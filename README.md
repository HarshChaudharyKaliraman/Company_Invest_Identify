# 🤖 AI Investment Research Agent

## Overview

This is an **AI-powered web app** that automatically researches any company and tells you whether to **Invest ✅** or **Pass ❌** — with full reasoning.

You just type a company name like "Apple" or "Zomato", and the AI agent:
1. Searches the web for information about the company
2. Checks its financial health
3. Reads recent news
4. Looks at competitors
5. Uses Google Gemini AI to make a final decision

---

## How to Run It

### Step 1: Setup API Keys

Go into the `backend/` folder. Copy `.env.example` and rename it to `.env`.  
Then fill in your API keys:

```
GEMINI_API_KEY=your_key_here      ← From https://aistudio.google.com
TAVILY_API_KEY=your_key_here      ← From https://app.tavily.com
PORT=5000
```

### Step 2: Start the Backend (the AI server)

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

You should see: ✅ Server is running at http://localhost:5000

### Step 3: Start the Frontend (the website)

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## How It Works — Architecture

```
USER types company name
        ↓
[React Frontend] sends request to backend
        ↓
[Node.js + Express] receives the request
        ↓
[LangGraph Agent] runs 5 research steps:
   Step 1 → Tavily searches "company overview"
   Step 2 → Tavily searches "financial data"
   Step 3 → Tavily searches "recent news"
   Step 4 → Tavily searches "competitors"
   Step 5 → Google Gemini AI reads all results
            and decides: INVEST or PASS
        ↓
[Backend] sends result back to frontend
        ↓
[React Frontend] shows verdict + reasoning
```

### What is LangGraph?
LangGraph is a framework that lets you build AI agents that work in steps (called a "graph"). Each step is a "node". Data flows from one node to the next like an assembly line. This is perfect for research tasks where you need to gather information from multiple sources before making a decision.

### What is Tavily?
Tavily is a search engine built specifically for AI agents. Unlike Google, it returns clean, structured results that AI can easily read and understand.

### What is Gemini?
Google Gemini is a large language model (LLM) — it is the AI that reads all the research and writes the final INVEST or PASS verdict.

---

## Key Decisions and Trade-offs

| Decision | What I chose | Why |
|---|---|---|
| Frontend | React (Vite) | Fast to develop, widely used |
| Backend | Node.js + Express | Simple, works well with LangChain.js |
| AI Framework | LangGraph.js | Perfect for multi-step agents |
| LLM | Google Gemini Flash | Free tier available, fast responses |
| Search | Tavily API | Made for AI agents, clean results |

**What I left out:**
- User authentication (not needed for this demo)
- Database to store past searches (would add with MongoDB in v2)
- Streaming responses (agent steps update in real-time on the backend, frontend shows simulated progress)

---

## Example Runs

### Example 1: Apple Inc.
- **Verdict**: INVEST
- **Confidence**: 82%
- **Summary**: Apple has strong financials, loyal customer base, and continuous innovation
- **Financial Score**: 9/10
- **News Sentiment**: Positive
- **Market Position**: Strong

### Example 2: Paytm
- **Verdict**: PASS
- **Confidence**: 71%
- **Summary**: Regulatory challenges and profitability concerns outweigh growth potential
- **Financial Score**: 4/10
- **News Sentiment**: Negative
- **Market Position**: Moderate

### Example 3: Tesla
- **Verdict**: INVEST
- **Confidence**: 68%
- **Summary**: Market leader in EVs with strong brand, but high valuation is a risk
- **Financial Score**: 7/10
- **News Sentiment**: Neutral
- **Market Position**: Strong

---

## What I Would Improve With More Time

1. **Real-time streaming**: Show each research step result as it arrives (using Server-Sent Events)
2. **Save history**: Store past searches in MongoDB so users can revisit results
3. **Compare companies**: Research 2 companies side by side and recommend which to invest in
4. **Stock price integration**: Pull live stock data from Yahoo Finance API
5. **Deploy on Vercel**: Host the frontend on Vercel and backend on Render for public access
6. **More research steps**: Add sentiment analysis of social media (Twitter/Reddit) about the company

---

## Tech Stack Summary

- **React** - Frontend UI framework (what the user sees)
- **Node.js + Express** - Backend server (handles requests, runs the agent)
- **LangChain.js** - Library to connect to AI models like Gemini
- **LangGraph.js** - Builds the multi-step research agent (the brain)
- **Google Gemini** - The AI model that reads research and makes decisions
- **Tavily** - Web search API that the AI agent uses to find company info
- **Axios** - Used in React to send HTTP requests to the backend
