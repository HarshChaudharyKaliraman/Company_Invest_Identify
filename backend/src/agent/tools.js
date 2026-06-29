// ============================================
// TOOLS FILE
// A "tool" is something the AI agent can USE
// Here we give the agent one tool: "search the web"
// It uses Tavily (a search engine made for AI agents)
// ============================================

import dotenv from "dotenv";
import { tavily } from "@tavily/core";

// Load .env file so API keys are available
dotenv.config();

// Create a Tavily client using our API key
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY });


// This function searches the web and returns a text summary
// The agent calls this whenever it needs to find information online
export async function searchWeb(query) {
  try {
    const response = await tavilyClient.search(query, {
      maxResults: 5, // Get top 5 search results
      searchDepth: "basic",
    });

    // Combine all result snippets into one big text
    if (response.results && response.results.length > 0) {
      return response.results
        .map((r) => `Source: ${r.title}\n${r.content}`)
        .join("\n\n---\n\n");
    }
    return `No results found for: ${query}`;
  } catch (error) {
    console.error("Search error:", error.message);
    return `Could not search for: ${query}. Error: ${error.message}`;
  }
}
