import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";
import "../../assets/styles/SummaryCard.css";

const SummaryResultCard = () => {

  const { data } = useSelector((state: RootState) => state.summary);
  console.log("data",data);
  

    return (
        <>
        <div style={{ marginTop: 26, animation: "fadeUp .45s ease both" }}>
                <div className="result-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 700, color: "#1e1b4b", lineHeight: 1.35, flex: 1, minWidth: 160, margin: 0 }}>
                    result.title
                  </h2>
                  <div className="meta-tags-row" style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="meta-tag">⏱  result.readingTime</span>
                    <span className="meta-tag">result.wordCount.toLocaleString() words</span>
                  </div>
                </div>

                <div className="divider" />

                <p className="section-label">Summary</p>
                <p style={{ fontSize: "clamp(13px, 3vw, 15px)", lineHeight: 1.78, color: "#374151" }}>result.summary</p>

                <div className="divider" />

                <p className="section-label">Key Points</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* {result.keyPoints.map((pt, i) => (
                    <div key={i} className="point-pill">
                      <span className="dot-accent" />
                      {pt}
                    </div>
                  ))} */}
                </div>

                <div className="url-chip">
                  <span style={{ flexShrink: 0 }}>🔗</span>
                  <a  target="_blank" rel="noopener noreferrer">url</a>
                </div>

                <button className="reset-btn" >← Summarise another page</button>
              </div>
        </>
    );
};
export default SummaryResultCard;