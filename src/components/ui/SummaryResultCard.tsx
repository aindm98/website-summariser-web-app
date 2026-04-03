import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../services/store/store";
import "../../assets/styles/SummaryResultCard.css";
import { clear } from "../../services/slices/SummarySlice";

interface SummaryResultCardProps {
  setUrl: (url: string) => void;
}
const SummaryResultCard = ({ setUrl }: SummaryResultCardProps) => {
  const dispatch = useAppDispatch();

  const { data } = useSelector((state: RootState) => state.summary);
  const formattedPoints = data
    ? data
        .split(/\n\s*-\s+/)
        .map((point) => point.replace(/^- /, "").trim())
        .filter(Boolean)
    : [];

  const handleReset = () => {
    dispatch(clear());
    setUrl("");
  };

  return (
    <>
      <div style={{ marginTop: 26, animation: "fadeUp .45s ease both" }}>
        <div
          className="result-header"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        ></div>

        <p className="section-label">Summary</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {formattedPoints?.map((pt, i) => (
            <div key={i} className="point-pill">
              <span className="dot-accent" />
              {pt}
            </div>
          ))}
        </div>
        <button className="reset-btn" type="button" onClick={handleReset}>
          Summarise another page
        </button>
      </div>
    </>
  );
};
export default SummaryResultCard;
