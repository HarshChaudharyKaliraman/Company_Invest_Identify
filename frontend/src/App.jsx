// ============================================
// MAIN APP FILE
// This is the "manager" of all components
// It decides WHAT to show based on what is happening:
//   - If idle: show the search bar
//   - If loading: show the loading animation
//   - If done: show the result card
//   - If error: show the error message
// ============================================

import { useState } from "react";
import axios from "axios";
import LoadingState from "./components/LoadingState.jsx";
import ResultCard from "./components/ResultCard.jsx";

// Backend URL — where we send our research requests
const BACKEND_URL = "http://localhost:5000/api/research";

// Some example companies the user can click to try
const SUGGESTED_COMPANIES = ["Apple", "Tesla", "Zomato", "Reliance", "OpenAI"];

function App() {
  // useState = variables that React watches and re-renders when they change
  const [companyName, setCompanyName] = useState("");    // What user typed
  const [status, setStatus] = useState("idle");          // idle | loading | done | error
  const [result, setResult] = useState(null);            // The research result
  const [errorMsg, setErrorMsg] = useState("");          // Error message text
  const [currentStep, setCurrentStep] = useState(0);    // Which step is running (0-4)
  const [isWaiting, setIsWaiting] = useState(false);    // True when all steps are green but still waiting

  // This function runs when user clicks "Research" button
  async function handleResearch() {
    if (!companyName.trim()) return; // Don't do anything if input is empty

    // Reset everything and show loading state
    setStatus("loading");
    setResult(null);
    setErrorMsg("");
    setCurrentStep(0);
    setIsWaiting(false);

    // Simulate step-by-step progress on the frontend
    // Each step moves every 8 seconds (research now has 6 steps ~50 seconds total)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 5) return prev + 1;
        // All 6 steps are now green — but backend may still be working
        setIsWaiting(true);
        clearInterval(stepInterval);
        return prev;
      });
    }, 8000); // Move to next step every 8 seconds

    try {
      // Send the company name to our backend
      // timeout: 3 minutes — research can take 40-60 seconds
      const response = await axios.post(BACKEND_URL, {
        companyName: companyName.trim(),
      }, { timeout: 180000 });

      clearInterval(stepInterval);  
      setIsWaiting(false);
      setCurrentStep(5); // All steps done

      // Small delay so user sees all steps completed
      setTimeout(() => {
        setResult(response.data);
        setStatus("done");
      }, 500);

    } catch (error) {
      clearInterval(stepInterval);
      setIsWaiting(false);
      setStatus("error");
      // Show the actual error message from backend, or a helpful fallback
      const msg = error.response?.data?.error
        || error.response?.data?.details
        || (error.code === "ECONNABORTED" ? "Request timed out (took too long). Please try again." : null)
        || (error.code === "ERR_NETWORK" ? "Cannot connect to backend. Make sure it is running on port 5000." : null)
        || "Something went wrong. Check the backend terminal for error details.";
      setErrorMsg(msg);
    }
  }

  // Reset everything back to the search screen
  function handleNewSearch() {
    setStatus("idle");
    setResult(null);
    setCompanyName("");
    setCurrentStep(0);
  }

  // Run search when user presses Enter key
  function handleKeyDown(e) {
    if (e.key === "Enter") handleResearch();
  }

  return (
    <div className="app-wrapper">
      {/* Animated background blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <div className="app-container">

        {/* ── HEADER ── */}
        <header className="app-header">
          <div className="header-badge">
            <span className="dot" />
            AI Powered · LangGraph · Groq (Llama 3)
          </div>
          <h1 className="app-title">Investment Research Agent</h1>
          <p className="app-subtitle">
            Type any company name. Our AI agent will research it and tell you
            whether to <strong>Invest ✅</strong> or <strong>Pass ❌</strong>.
          </p>
        </header>

        {/* ── SEARCH BAR (only show when not loading or showing results) ── */}
        {status !== "loading" && status !== "done" && (
          <section className="search-container">
            <div className="search-box">
              <span className="search-icon">🏢</span>
              <input
                id="company-search-input"
                className="search-input"
                type="text"
                placeholder="e.g. Apple, Tesla, Zomato, Reliance..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                id="research-btn"
                className="search-btn"
                onClick={handleResearch}
                disabled={!companyName.trim()}
              >
                🔍 Research
              </button>
            </div>

            {/* Quick suggestion chips */}
            <div className="suggestions">
              <span className="suggestions-label">Try:</span>
              {SUGGESTED_COMPANIES.map((company) => (
                <button
                  key={company}
                  className="suggestion-chip"
                  onClick={() => setCompanyName(company)}
                >
                  {company}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── LOADING STATE ── */}
        {status === "loading" && (
          <LoadingState
            companyName={companyName}
            currentStep={currentStep}
            isWaiting={isWaiting}
          />
        )}


        {/* ── ERROR STATE ── */}
        {status === "error" && (
          <div className="error-box">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Research Failed</h3>
            <p className="error-msg">{errorMsg}</p>
            <button
              className="new-search-btn"
              style={{ marginTop: "16px" }}
              onClick={handleNewSearch}
            >
              ← Try Again
            </button>
          </div>
        )}

        {/* ── RESULT CARD ── */}
        {status === "done" && result && (
          <ResultCard data={result} onNewSearch={handleNewSearch} />
        )}

        {/* ── FOOTER ── */}
        <footer className="app-footer">
          Built with React · Node.js · LangGraph.js · Groq (Llama 3) · Tavily
        </footer>

      </div>
    </div>
  );
}

export default App;
