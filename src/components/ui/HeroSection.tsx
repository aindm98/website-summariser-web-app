import "../../assets/styles/HeroSection.css";
const HeroSection = () => {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          animation: "fadeUp .6s ease both",
          marginTop:60,
        }}
      >
        <div className="badge-pill">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#7c3aed",
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          AI Powered
        </div>
        <h1
          style={{
            fontSize: "clamp(38px, 8vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            color: "#1e1b4b",
          }}
        >
          Web<span style={{ color: "#7c3aed" }}>Lens</span>
        </h1>
        <p
          style={{
            marginTop: 14,
            color: "#6b7280",
            fontSize: "clamp(14px, 3vw, 16px)",
            fontWeight: 400,
            lineHeight: 1.65,
            maxWidth: 400,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Paste any public URL and get a crisp, AI-generated summary in seconds.
        </p>
      </div>
    </>
  );
};
export default HeroSection;
