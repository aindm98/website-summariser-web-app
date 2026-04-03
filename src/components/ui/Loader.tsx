import { useState, useEffect } from "react";
import "../../assets/styles/Loader.css";

interface LoadingStateProps {
  phaseLabel: string;
}


const Loader = ({ phaseLabel }: LoadingStateProps) => {
  const [dots, setDots] = useState(".");

   useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(t);
  }, []);
  
  return (
    <>
      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="spinner" />
          <span
            style={{
              fontSize: 12.5,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#7c3aed",
            }}
          >
            {phaseLabel}
            {dots}
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" />
        </div>
      </div>
    </>
  );
};
export default Loader;
