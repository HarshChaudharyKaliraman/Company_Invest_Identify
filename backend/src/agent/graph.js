// ============================================
// GRAPH FILE — The Brain of our Agent
// LangGraph lets us connect steps in a "graph"
// Like a flowchart:
//   Step1 → Step2 → Step3 → Step4 → Step5 → Step6 → Done
//
// Why LangGraph? Because:
//   - It keeps track of all research results (called "state")
//   - Each step passes its result to the next step
//   - It's like an assembly line in a factory
// ============================================

import { StateGraph, END } from "@langchain/langgraph";
import {
  searchOverviewNode,
  searchFinancialsNode,
  searchNewsNode,
  searchCompetitorsNode,
  searchFundamentalsNode,
  analyzeAndDecideNode,
} from "./nodes.js";

// Build the graph (the flowchart)
export function buildResearchGraph() {
  // Create a new graph with our state definition
  // Each field in "channels" is a piece of data the agent tracks
  const graph = new StateGraph({
    channels: {
      companyName:   { value: (x, y) => y ?? x, default: () => null },
      overview:      { value: (x, y) => y ?? x, default: () => null },
      financials:    { value: (x, y) => y ?? x, default: () => null },
      exchangeInfo:  { value: (x, y) => y ?? x, default: () => null },  // NEW: exchange data
      fundamentals:  { value: (x, y) => y ?? x, default: () => null },  // NEW: fundamentals
      news:          { value: (x, y) => y ?? x, default: () => null },
      competitors:   { value: (x, y) => y ?? x, default: () => null },
      verdict:       { value: (x, y) => y ?? x, default: () => null },
      confidence:    { value: (x, y) => y ?? x, default: () => null },
      analysis:      { value: (x, y) => y ?? x, default: () => null },
      steps:         { value: (x, y) => y ?? x, default: () => [] },
    },
  });

  // Add each research step as a "node" in the graph
  graph.addNode("searchOverview",      searchOverviewNode);
  graph.addNode("searchFinancials",    searchFinancialsNode);
  graph.addNode("searchNews",          searchNewsNode);
  graph.addNode("searchCompetitors",   searchCompetitorsNode);
  graph.addNode("searchFundamentals",  searchFundamentalsNode);   // NEW
  graph.addNode("analyzeAndDecide",    analyzeAndDecideNode);

  // Connect the nodes in order (the flowchart arrows →)
  graph.setEntryPoint("searchOverview");
  graph.addEdge("searchOverview",     "searchFinancials");     // Step 1 → Step 2
  graph.addEdge("searchFinancials",   "searchNews");           // Step 2 → Step 3
  graph.addEdge("searchNews",         "searchCompetitors");    // Step 3 → Step 4
  graph.addEdge("searchCompetitors",  "searchFundamentals");   // Step 4 → Step 5
  graph.addEdge("searchFundamentals", "analyzeAndDecide");     // Step 5 → Step 6
  graph.addEdge("analyzeAndDecide",   END);                    // Step 6 → Done!

  // Compile turns the graph into something we can actually run
  return graph.compile();
}
