// ============================================
// LOADING STATE COMPONENT
// Shows while the agent is doing its 6-step research
// isWaiting = true when all steps are green but result hasn't arrived yet
// ============================================

const STEP_ICONS = ["🔍", "💰", "📰", "⚔️", "📈", "🧠"];
const STEP_NAMES = [
  "Searching Company Overview",
  "Checking Financial Health & Exchange",
  "Reading Recent News",
  "Analyzing Market & Competitors",
  "Fetching Fundamentals (PE, Market Cap...)",
  "AI Making Final Decision",
];

function LoadingState({ companyName, currentStep, isWaiting }) {
  const progress = Math.min(((currentStep + 1) / 6) * 100, 100);

  return (
    <div className="loading-container">
      <h2 className="loading-title">Researching {companyName}...</h2>

      {isWaiting ? (
        <p className="loading-subtitle" style={{ color: "#f59e0b" }}>
          ⏳ All research done! AI is writing the final verdict...
          <br />
          <small style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            This can take 10–20 more seconds. Please wait!
          </small>
        </p>
      ) : (
        <p className="loading-subtitle">
          Our AI agent is searching the web and analyzing the data
        </p>
      )}

      <div className="steps-list">
        {STEP_NAMES.map((name, index) => {
          const isDone = index < currentStep || isWaiting;
          const isActive = index === currentStep && !isWaiting;
          const statusClass = isDone ? "done" : isActive ? "active" : "";

          return (
            <div key={index} className={`step-item ${statusClass}`}>
              <div className="step-icon">
                {isDone ? "✅" : isActive ? "⏳" : STEP_ICONS[index]}
              </div>
              <span className="step-label">{name}</span>
            </div>
          );
        })}
      </div>

      <div className="loading-bar-wrapper">
        <div
          className="loading-bar"
          style={{ width: isWaiting ? "95%" : `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingState;
