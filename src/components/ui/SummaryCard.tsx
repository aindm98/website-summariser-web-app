import { useState } from "react";
import "../../assets/styles/SummaryCard.css";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../services/store/store";
import { fetchSummary } from "../../services/slices/SummarySlice";
import Loader from "../ui/Loader";

const SummaryCard = () => {
  const { loading } = useSelector((state: RootState) => state.summary);
  const [url, setUrl] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (url) {
      dispatch(fetchSummary({ articleUrl: url }));
    }
  };

  return (
    <>
      {loading ? (
        <Loader phaseLabel="Fetching page content" />
      ) : (
        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            <div className="wl-input-row">
              <input
                className="glass-input"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                // onKeyDown={e => e.key === "Enter" && handleSubmit()}
                disabled={loading}
                aria-label="Enter URL to summarise"
              />
              <button className="glass-btn" type="submit">
                {loading ? "Working…" : "Summarise →"}
              </button>
            </div>
          </form>
          {/* Loading */}

          {/* Error */}

          {/* <div style={{
                marginTop: 18, background: "rgba(254,226,226,0.65)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(252,165,165,0.6)", borderRadius: 13,
                padding: "12px 16px", color: "#dc2626",
                fontSize: 13, fontFamily: "'JetBrains Mono', monospace"
              }}>
                ⚠ error
              </div>
             */}

          {/* Results */}

          {/* <div style={{ marginTop: 26, animation: "fadeUp .45s ease both" }}>

                <div className="result-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 700, color: "#1e1b4b", lineHeight: 1.35, flex: 1, minWidth: 160, margin: 0 }}>
                    result.title
                  </h2>
                  <div className="meta-tags-row" style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="meta-tag">⏱ result.readingTime</span>
                    <span className="meta-tag">result.wordCount.toLocaleString() words</span>
                  </div>
                </div>

                <div className="divider" />

                <p className="section-label">Summary</p>
                <p style={{ fontSize: "clamp(13px, 3vw, 15px)", lineHeight: 1.78, color: "#374151" }}>{result.summary}</p>

                <div className="divider" />

                <p className="section-label">Key Points</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.keyPoints.map((pt, i) => (
                    <div key={i} className="point-pill">
                      <span className="dot-accent" />
                      {pt}
                    </div>
                  ))}
                </div>

                <div className="url-chip">
                  <span style={{ flexShrink: 0 }}>🔗</span>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </div>

                <button className="reset-btn" onClick={reset}>← Summarise another page</button>
              </div> */}
        </div>
      )}
    </>
  );
};
export default SummaryCard;
