import { useState } from "react";
import "../../assets/styles/SummaryCard.css";
import { useSelector } from "react-redux";
import { type RootState, useAppDispatch } from "../../services/store/store";
import { fetchSummary } from "../../services/slices/SummarySlice";
import Loader from "../ui/Loader";
// import { urlValidator } from "../utils/urlValidator";

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
                required
              />
              <button className="glass-btn" type="submit">
                {loading ? "Working…" : "Summarise →"}
              </button>
            </div>
          </form>

         
        </div>
      )}
    </>
  );
};
export default SummaryCard;
