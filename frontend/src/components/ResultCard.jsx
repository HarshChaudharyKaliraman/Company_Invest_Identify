// ============================================
// RESULT CARD COMPONENT
// Shows the final investment verdict + company profile + research details
// ============================================

function ResultCard({ data, onNewSearch }) {
  const { companyName, verdict, confidence, analysis } = data;
  const profile = analysis?.profile || {};

  const isInvest = verdict === "INVEST";
  const verdictClass = isInvest ? "invest" : "pass";

  const getSentimentClass = (s) => (s || "").toLowerCase();
  const getPositionClass = (p) => (p || "").toLowerCase();

  return (
    <div className="result-container">

      {/* ── TOP: Big INVEST or PASS verdict ── */}
      <div className={`verdict-banner ${verdictClass}`}>
        <span className="verdict-emoji">{isInvest ? "✅" : "❌"}</span>
        <p className="verdict-label">Our AI Recommends</p>
        <h2 className="verdict-text">{verdict}</h2>
        <p className="verdict-company">for {companyName}</p>

        {/* Exchange + Ticker pill */}
        {profile.exchange && profile.exchange !== "N/A" && (
          <div className="exchange-pill">
            <span className="exchange-icon">🏦</span>
            <span className="exchange-name">{profile.exchange}</span>
            {profile.ticker && profile.ticker !== "N/A" && (
              <span className="exchange-ticker">{profile.ticker}</span>
            )}
          </div>
        )}      

        {/* Confidence bar */}
        <div className="confidence-wrap">
          <div className="confidence-label">
            <span>AI Confidence</span>
            <span className="confidence-num">{confidence}%</span>
          </div>
          <div className="confidence-bar-bg">
            <div className="confidence-bar-fill" style={{ width: `${confidence}%` }} />
          </div>
        </div>
      </div>

      {/* ── DETAILS SECTION ── */}
      <div className="result-details">

        {/* One-line summary */}
        <div className="summary-box">
          <p className="summary-text">💡 {analysis?.summary}</p>
        </div>

        {/* ── COMPANY PROFILE / FUNDAMENTALS ── */}
        {profile && (
          <div className="profile-section">
            <h3 className="profile-title">🏢 Company Profile & Fundamentals</h3>

            {/* Description */}
            {profile.description && profile.description !== "N/A" && (
              <p className="profile-description">{profile.description}</p>  
            )}

            {/* Fundamentals grid */}
            <div className="fundamentals-grid">
              <div className="fundamental-item">
                <span className="fund-label">📍 Headquarters</span>
                <span className="fund-value">{profile.headquarters || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">🏭 Sector</span>
                <span className="fund-value">{profile.sector || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">📅 Founded</span>
                <span className="fund-value">{profile.founded || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">👥 Employees</span>
                <span className="fund-value">{profile.employees || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">💰 Market Cap</span>
                <span className="fund-value fund-highlight">{profile.market_cap || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">📊 Revenue</span>
                <span className="fund-value fund-highlight">{profile.revenue || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">📈 PE Ratio</span>
                <span className="fund-value">{profile.pe_ratio || "N/A"}</span>
              </div>
              <div className="fundamental-item">
                <span className="fund-label">💵 EPS</span>
                <span className="fund-value">{profile.eps || "N/A"}</span>
              </div>
            </div>
          </div>
        )}

        {/* 3 quick metrics */}
        <div className="metrics-row">
          <div className="metric-item">
            <p className="metric-label">Financial Score</p>
            <p className="metric-value">{analysis?.financial_score} / 10</p>
          </div>
          <div className="metric-item">
            <p className="metric-label">News Sentiment</p>
            <p className={`metric-value ${getSentimentClass(analysis?.news_sentiment)}`}>
              {analysis?.news_sentiment}
            </p>
          </div>
          <div className="metric-item">
            <p className="metric-label">Market Position</p>
            <p className={`metric-value ${getPositionClass(analysis?.market_position)}`}>
              {analysis?.market_position} 
            </p>
          </div>
        </div>

        {/* Reasons to invest vs reasons to pass */}
        <div className="reasons-grid">
          <div className="reasons-column">
            <h4 className="reasons-title green">✅ Reasons to Invest</h4>
            <ul className="reasons-list">
              {(analysis?.reasons_to_invest || []).map((reason, i) => (
                <li key={i}><span className="reason-dot" />{reason}</li>
              ))}
            </ul>
          </div>
          <div className="reasons-column">
            <h4 className="reasons-title red">⚠️ Risks / Reasons to Pass</h4>
            <ul className="reasons-list">
              {(analysis?.reasons_to_pass || []).map((reason, i) => (
                <li key={i}><span className="reason-dot" />{reason}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full AI analysis paragraph */}
        <div className="analysis-box">
          <h4 className="analysis-title">🤖 Full AI Analysis</h4>
          <p className="analysis-text">{analysis?.full_analysis}</p>
        </div>
      </div>

      {/* Button to search another company */}
      <button className="new-search-btn" onClick={onNewSearch}>
        🔍 Research Another Company
      </button>
    </div>
  );
}

export default ResultCard;
