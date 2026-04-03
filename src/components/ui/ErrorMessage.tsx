import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";

const ErrorMessage =() => {
    const { error } = useSelector((state: RootState) => state.summary);
    console.log("err",error);
    
    return (
        <>
            <div style={{
                marginTop: 18, background: "rgba(254,226,226,0.65)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(252,165,165,0.6)", borderRadius: 13,
                padding: "12px 16px", color: "#dc2626",
                fontSize: 13, fontFamily: "'JetBrains Mono', monospace"
              }}>
                ⚠ {error}
              </div>
        </>
    );
};
export default ErrorMessage;