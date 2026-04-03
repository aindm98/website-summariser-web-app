import { useState, useEffect, useRef } from "react";

interface SummaryResult {
  title: string;
  summary: string;
  keyPoints: string[];
  readingTime: string;
  wordCount: number;
}

async function fetchPageText(url: string): Promise<string> {
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("Failed to fetch the page. Please check the URL.");
  const json = await res.json();
  const html: string = json.contents ?? "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ");
  return (tmp.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 8000);
}

async function summariseWithClaude(pageText: string, url: string): Promise<SummaryResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a precise web-content analyst.\nURL: ${url}\nPAGE TEXT: """${pageText}"""\nRespond ONLY with a valid JSON object (no markdown, no extra text):\n{"title":"<page title max 10 words>","summary":"<3-5 sentence summary>","keyPoints":["<point 1>","<point 2>","<point 3>"],"readingTime":"<e.g. 4 min read>","wordCount":<integer>}`
      }]
    })
  });
  if (!res.ok) throw new Error("AI request failed. Please try again.");
  const data = await res.json();
  const raw = data.content?.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("") ?? "";
  return JSON.parse(raw.replace(/```json|```/g, "").trim()) as SummaryResult;
}

function Orb({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none", ...style }} />;
}

export default function WebSummariser() {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "fetching" | "summarising" | "done" | "error">("idle");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState("");
  const [phaseLabel, setPhaseLabel] = useState("");
  const [dots, setDots] = useState(".");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (phase !== "fetching" && phase !== "summarising") return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(t);
  }, [phase]);

  // Close menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleSubmit = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    setError(""); setResult(null);
    try {
      setPhase("fetching"); setPhaseLabel("Fetching page content");
      const text = await fetchPageText(withProto);
      setPhase("summarising"); setPhaseLabel("Generating AI summary");
      setResult(await summariseWithClaude(text, withProto));
      setPhase("done");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("error");
    }
  };

  const isLoading = phase === "fetching" || phase === "summarising";
  const reset = () => {
    setPhase("idle"); setResult(null); setError(""); setUrl("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
        @keyframes pulse   { 0%,100% { opacity:0.55; transform:scale(1); } 50% { opacity:1; transform:scale(1.08); } }
        @keyframes barMove { 0% { left:-60%; width:45%; } 100% { left:110%; width:45%; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

        .wl-root {
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: linear-gradient(145deg, #eef2ff 0%, #faf5ff 40%, #ede9fe 70%, #ddd6fe 100%);
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── NAVBAR ── */
        .wl-nav {
          position: sticky; top: 0; z-index: 200;
          width: 100%;
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(24px) saturate(1.8);
          -webkit-backdrop-filter: blur(24px) saturate(1.8);
          border-bottom: 1px solid rgba(255,255,255,0.72);
          box-shadow: 0 2px 20px rgba(109,40,217,0.07), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .wl-nav-inner {
          max-width: 1100px; margin: 0 auto;
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }

        .wl-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .wl-logo-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          box-shadow: 0 4px 12px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center; font-size: 16px;
        }
        .wl-logo-text { font-size: 18px; font-weight: 700; letter-spacing: -0.03em; color: #1e1b4b; }
        .wl-logo-text span { color: #7c3aed; }

        .wl-nav-links {
          display: flex; align-items: center; gap: 2px;
        }
        .wl-nav-link {
          padding: 7px 14px; border-radius: 10px; font-size: 14px; font-weight: 500;
          color: #6b7280; background: transparent; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .wl-nav-link:hover { background: rgba(124,58,237,0.07); color: #7c3aed; }
        .wl-nav-link.active { background: rgba(124,58,237,0.1); color: #7c3aed; font-weight: 600; }

        .wl-nav-right {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .wl-nav-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(124,58,237,0.09); border: 1px solid rgba(124,58,237,0.18);
          border-radius: 100px; padding: 4px 11px;
          font-size: 11.5px; font-weight: 600; color: #7c3aed; letter-spacing: 0.01em;
        }
        .wl-nav-btn {
          background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(99,102,241,0.9));
          border: 1px solid rgba(167,139,250,0.35); border-radius: 10px;
          box-shadow: 0 3px 10px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.2);
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 13px; padding: 8px 18px; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s; white-space: nowrap;
        }
        .wl-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 16px rgba(124,58,237,0.32); }

        /* Hamburger */
        .wl-hamburger {
          display: none; flex-direction: column; justify-content: center; gap: 5px;
          width: 36px; height: 36px; background: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.8); border-radius: 10px; cursor: pointer;
          padding: 8px; transition: background 0.15s;
        }
        .wl-hamburger:hover { background: rgba(255,255,255,0.75); }
        .wl-hamburger span {
          display: block; height: 2px; border-radius: 2px;
          background: #7c3aed; transition: transform 0.2s, opacity 0.2s;
        }

        /* Mobile drawer */
        .wl-mobile-menu {
          display: none;
          position: absolute; top: 64px; left: 0; right: 0;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px) saturate(1.8);
          -webkit-backdrop-filter: blur(24px) saturate(1.8);
          border-bottom: 1px solid rgba(255,255,255,0.72);
          box-shadow: 0 8px 24px rgba(109,40,217,0.1);
          padding: 12px 20px 20px;
          flex-direction: column; gap: 4px;
          animation: slideDown 0.2s ease both;
          z-index: 199;
        }
        .wl-mobile-menu.open { display: flex; }
        .wl-mobile-link {
          padding: 11px 14px; border-radius: 12px; font-size: 15px; font-weight: 500;
          color: #4b5563; background: transparent; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif; text-align: left;
          transition: background 0.15s, color 0.15s;
        }
        .wl-mobile-link:hover { background: rgba(124,58,237,0.07); color: #7c3aed; }
        .wl-mobile-link.active { background: rgba(124,58,237,0.1); color: #7c3aed; font-weight: 600; }
        .wl-mobile-divider { height: 1px; background: rgba(167,139,250,0.2); margin: 8px 0; }
        .wl-mobile-cta {
          background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(99,102,241,0.9));
          border: 1px solid rgba(167,139,250,0.35); border-radius: 12px;
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 14px; padding: 12px; cursor: pointer;
          margin-top: 4px; text-align: center;
          box-shadow: 0 4px 14px rgba(124,58,237,0.25);
        }

        /* ── MAIN CONTENT ── */
        .wl-content {
          width: 100%; max-width: 1100px;
          display: flex; flex-direction: column; align-items: center;
          padding: 52px 20px 80px;
          position: relative; z-index: 1;
        }

        /* ── GLASS CARD ── */
        .glass-card {
          width: 100%; max-width: 660px;
          background: rgba(255,255,255,0.52);
          backdrop-filter: blur(28px) saturate(1.9);
          -webkit-backdrop-filter: blur(28px) saturate(1.9);
          border: 1px solid rgba(255,255,255,0.78);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(109,40,217,0.09), 0 2px 8px rgba(0,0,0,0.04), inset 0 1.5px 0 rgba(255,255,255,0.92);
          position: relative; padding: 28px;
          animation: fadeUp .65s .12s ease both;
        }
        .glass-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 24px;
          background: linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 55%);
          pointer-events: none;
        }

        /* ── INPUT ROW ── */
        .wl-input-row { display: flex; gap: 10px; }

        .glass-input {
          flex: 1; min-width: 0;
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.85); border-radius: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95);
          padding: 14px 18px;
          font-family: 'JetBrains Mono', monospace; font-size: 13.5px; color: #1e1b4b;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .glass-input::placeholder { color: #c4b5fd; }
        .glass-input:focus {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 0 0 4px rgba(124,58,237,0.1), 0 2px 8px rgba(0,0,0,0.04);
        }
        .glass-input:disabled { opacity: 0.65; }

        .glass-btn {
          background: linear-gradient(135deg, rgba(124,58,237,0.88) 0%, rgba(99,102,241,0.88) 100%);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(167,139,250,0.45); border-radius: 14px;
          box-shadow: 0 4px 16px rgba(124,58,237,0.28), inset 0 1px 0 rgba(255,255,255,0.22);
          color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 14px; padding: 14px 22px; cursor: pointer;
          white-space: nowrap; flex-shrink: 0;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .glass-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.38), inset 0 1px 0 rgba(255,255,255,0.28);
        }
        .glass-btn:active:not(:disabled) { transform: translateY(0); }
        .glass-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── MISC ── */
        .badge-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.62); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.88);
          box-shadow: 0 2px 8px rgba(124,58,237,0.1);
          border-radius: 100px; padding: 6px 16px;
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: #7c3aed; font-family: 'JetBrains Mono', monospace; margin-bottom: 20px;
        }
        .meta-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.88);
          backdrop-filter: blur(8px); border-radius: 100px; padding: 4px 12px;
          font-size: 12px; font-family: 'JetBrains Mono', monospace; color: #6d28d9;
          white-space: nowrap;
        }
        .section-label {
          font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase;
          color: #a78bfa; font-family: 'JetBrains Mono', monospace;
          font-weight: 500; margin-bottom: 9px;
        }
        .point-pill {
          display: flex; align-items: flex-start; gap: 11px;
          background: rgba(255,255,255,0.48); border: 1px solid rgba(255,255,255,0.78);
          backdrop-filter: blur(8px); border-radius: 13px; padding: 11px 15px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          font-size: 13.5px; line-height: 1.6; color: #374151;
        }
        .dot-accent {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          flex-shrink: 0; margin-top: 5px;
          box-shadow: 0 0 7px rgba(124,58,237,0.45);
        }
        .url-chip {
          background: rgba(255,255,255,0.48); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.78); border-radius: 11px; padding: 9px 14px;
          display: flex; align-items: center; gap: 9px;
          font-size: 12px; font-family: 'JetBrains Mono', monospace;
          color: #9ca3af; margin-top: 18px; word-break: break-all;
        }
        .url-chip a { color: #7c3aed; text-decoration: none; }
        .url-chip a:hover { text-decoration: underline; }
        .reset-btn {
          width: 100%; margin-top: 16px;
          background: rgba(255,255,255,0.42); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.72); border-radius: 13px; padding: 12px;
          color: #6d28d9; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 13px; cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .reset-btn:hover { background: rgba(255,255,255,0.64); transform: translateY(-1px); }
        .spinner {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(124,58,237,0.15); border-top-color: #7c3aed;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        .progress-track {
          height: 3px; border-radius: 100px;
          background: rgba(167,139,250,0.18);
          position: relative; overflow: hidden; margin-top: 12px;
        }
        .progress-fill {
          position: absolute; top: 0; height: 100%;
          background: linear-gradient(90deg, transparent, #7c3aed, #a78bfa, transparent);
          border-radius: 100px; animation: barMove 1.4s ease-in-out infinite;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent);
          margin: 16px 0;
        }

        /* ── RESPONSIVE BREAKPOINTS ── */

        /* Tablet: ≤ 768px */
        @media (max-width: 768px) {
          .wl-nav-links { display: none; }
          .wl-nav-badge { display: none; }
          .wl-nav-btn   { display: none; }
          .wl-hamburger { display: flex; }

          .wl-content { padding: 36px 16px 60px; }

          .glass-card { padding: 22px 18px; border-radius: 20px; }

          .wl-input-row { flex-direction: column; gap: 10px; }
          .glass-btn { width: 100%; padding: 14px; font-size: 15px; }
          .glass-input { font-size: 14px; }
        }

        /* Mobile: ≤ 480px */
        @media (max-width: 480px) {
          .wl-nav-inner { padding: 0 16px; }
          .wl-logo-text { font-size: 16px; }

          .wl-content { padding: 28px 12px 48px; }

          .glass-card { padding: 18px 14px; border-radius: 18px; }

          .point-pill { font-size: 13px; padding: 10px 12px; }

          .badge-pill { font-size: 10px; padding: 5px 13px; }

          .result-header { flex-direction: column !important; gap: 10px !important; }
          .meta-tags-row { flex-direction: row !important; align-items: center !important; }
        }
      `}</style>

      <div className="wl-root">

        {/* ── NAVBAR ── */}
        <nav className="wl-nav">
          <div className="wl-nav-inner">

            {/* Logo */}
            <a className="wl-logo" href="#">
              <div className="wl-logo-icon">🔍</div>
              <span className="wl-logo-text">Web<span>Lens</span></span>
            </a>

            {/* Desktop nav links */}
            <div className="wl-nav-links">
              <button className="wl-nav-link active">Home</button>
              <button className="wl-nav-link">About</button>
              <button className="wl-nav-link">Tools</button>
              <button className="wl-nav-link">API</button>
            </div>

            {/* Desktop right side */}
            <div className="wl-nav-right">
              <span className="wl-nav-badge">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c3aed", display: "inline-block", animation: "pulse 2s infinite" }} />
                AI Live
              </span>
              <button className="wl-nav-btn">Try for Free →</button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="wl-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>

          {/* Mobile drawer */}
          <div className={`wl-mobile-menu ${menuOpen ? "open" : ""}`}>
            <button className="wl-mobile-link active" onClick={() => setMenuOpen(false)}>Home</button>
            <button className="wl-mobile-link" onClick={() => setMenuOpen(false)}>About</button>
            <button className="wl-mobile-link" onClick={() => setMenuOpen(false)}>Tools</button>
            <button className="wl-mobile-link" onClick={() => setMenuOpen(false)}>API</button>
            <div className="wl-mobile-divider" />
            <button className="wl-mobile-cta">Try for Free →</button>
          </div>
        </nav>

        {/* Ambient orbs */}
        <Orb style={{ width: 500, height: 500, top: -120, left: -140, background: "rgba(167,139,250,0.22)", animation: "float 9s ease-in-out infinite" }} />
        <Orb style={{ width: 360, height: 360, bottom: 20, right: -100, background: "rgba(99,102,241,0.18)", animation: "float 11s ease-in-out infinite reverse" }} />
        <Orb style={{ width: 220, height: 220, top: "38%", right: "8%", background: "rgba(196,181,253,0.28)", animation: "float 7s ease-in-out infinite" }} />
        <Orb style={{ width: 160, height: 160, top: "22%", left: "12%", background: "rgba(224,231,255,0.5)", animation: "float 8s ease-in-out 1.5s infinite" }} />

        {/* ── MAIN CONTENT ── */}
        <div className="wl-content">

          {/* Hero text */}
          <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp .6s ease both" }}>
            <div className="badge-pill">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block", animation: "pulse 2s infinite" }} />
              AI Powered
            </div>
            <h1 style={{ fontSize: "clamp(38px, 8vw, 72px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#1e1b4b" }}>
              Web<span style={{ color: "#7c3aed" }}>Lens</span>
            </h1>
            <p style={{ marginTop: 14, color: "#6b7280", fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 400, lineHeight: 1.65, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
              Paste any public URL and get a crisp, AI-generated summary in seconds.
            </p>
          </div>

          {/* Glass card */}
          <div className="glass-card">

            {/* Input row — stacks vertically on mobile */}
            <div className="wl-input-row">
              <input
                ref={inputRef}
                className="glass-input"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                disabled={isLoading}
                aria-label="Enter URL to summarise"
              />
              <button className="glass-btn" onClick={handleSubmit} disabled={isLoading || !url.trim()}>
                {isLoading ? "Working…" : "Summarise →"}
              </button>
            </div>

            {/* Loading */}
            {isLoading && (
              <div style={{ marginTop: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="spinner" />
                  <span style={{ fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace", color: "#7c3aed" }}>
                    {phaseLabel}{dots}
                  </span>
                </div>
                <div className="progress-track"><div className="progress-fill" /></div>
              </div>
            )}

            {/* Error */}
            {phase === "error" && (
              <div style={{
                marginTop: 18, background: "rgba(254,226,226,0.65)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(252,165,165,0.6)", borderRadius: 13,
                padding: "12px 16px", color: "#dc2626",
                fontSize: 13, fontFamily: "'JetBrains Mono', monospace"
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Results */}
            {phase === "done" && result && (
              <div style={{ marginTop: 26, animation: "fadeUp .45s ease both" }}>

                {/* Title + meta — wraps on small screens */}
                <div className="result-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "clamp(16px, 4vw, 19px)", fontWeight: 700, color: "#1e1b4b", lineHeight: 1.35, flex: 1, minWidth: 160, margin: 0 }}>
                    {result.title}
                  </h2>
                  <div className="meta-tags-row" style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span className="meta-tag">⏱ {result.readingTime}</span>
                    <span className="meta-tag">{result.wordCount.toLocaleString()} words</span>
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
              </div>
            )}
          </div>

          {/* Footer hint */}
          {phase === "idle" && (
            <p style={{ marginTop: 24, fontSize: 12, color: "#c4b5fd", fontFamily: "'JetBrains Mono', monospace", animation: "fadeUp .6s .3s ease both" }}>
              Press Enter or click Summarise to begin
            </p>
          )}
        </div>
      </div>
    </>
  );
}