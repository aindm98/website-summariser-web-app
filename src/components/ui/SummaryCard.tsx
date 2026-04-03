import { useState } from "react";
import "../../assets/styles/SummaryCard.css";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../services/store/store";
import { fetchSummary } from "../../services/slices/SummarySlice";
import Loader from "../ui/Loader";
import SummaryResultCard from "../ui/SummaryResultCard";
import ErrorMessage from "../ui/ErrorMessage";

const SummaryCard = () => {
  const { loading, data , error } = useSelector((state: RootState) => state.summary);
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
      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div className="wl-input-row">
            <input
              className="glass-input"
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              aria-label="Enter URL to summarise"
              required
            />
            <button
              className="glass-btn"
              type="submit"
              disabled={loading || !url?.trim()}
            >
              {loading ? "Working…" : "Summarise"}
            </button>
          </div>
        </form>
        {loading ? (
          <Loader phaseLabel="Fetching page content" />
        ) : data ? (
          <SummaryResultCard setUrl={setUrl} />
        ) : error ? (
          <ErrorMessage />
        ) : null}
      </div>
    </>
  );
};
export default SummaryCard;
