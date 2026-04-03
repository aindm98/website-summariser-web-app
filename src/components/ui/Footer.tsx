import { Link } from "react-router-dom";
import "../../assets/styles/Footer.css";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer_inner">
          <p className="footer_copy">
            © 2025 <span>WebLens</span>. Built by Aindrila Mukherjee.
          </p>
          <nav className="footer_links">
            {["GitHub"].map((l) => (
              <Link key={l} to={`https://github.com/aindm98/website-summariser-web-app`} className="footer_link" target="_blank" rel="noopener noreferrer">
                {l}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
};
export default Footer;
