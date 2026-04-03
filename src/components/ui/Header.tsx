import { useState, useEffect } from "react";
import "../../assets/styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <nav className="website-nav">
      <div className="website-nav-inner">
        <a href="#" className="website-logo">
          <div className="website-logo-icon">🔍</div>
          <div className="website-logo-text">Web<span>Lens</span></div>
        </a>
        <div className="website-nav-right">
          <div className="website-nav-badge">
           <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c3aed", display: "inline-block", animation: "pulse 2s infinite" }} />
            AI Live
          </div>
          <button className="website-nav-btn">Try for Free →</button>
        </div>

        <button
          className="website-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
        </button>
      </div>

      <div className={`website-mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="website-mobile-divider" />
        <button className="website-mobile-cta">Try for Free →</button>
      </div>
    </nav>
  );
};
export default Header;
